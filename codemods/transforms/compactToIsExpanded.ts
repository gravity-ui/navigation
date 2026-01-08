import type {
    API,
    ASTPath,
    ArrowFunctionExpression,
    Collection,
    FileInfo,
    FunctionExpression,
    JSCodeshift,
    JSXAttribute,
    JSXIdentifier,
    ObjectPattern,
    ObjectProperty,
} from 'jscodeshift';

/**
 * Codemod to transform `compact` prop to `isExpanded` with inverted boolean logic.
 *
 * Transformations:
 * - compact={true} → isExpanded={false}
 * - compact={false} → isExpanded={true}
 * - compact (shorthand) → isExpanded={false}
 * - compact={someVar} → isExpanded={!someVar}
 * - compact={!someVar} → isExpanded={someVar}
 * - compact={expression} → isExpanded={!(expression)}
 *
 * Special case for destructured parameters:
 * - renderFooter={({ compact }) => <FooterItem compact={compact} />}
 * - → renderFooter={({ isExpanded }) => <FooterItem isExpanded={isExpanded} />}
 * - (No inversion when the value is the renamed destructured parameter)
 *
 * Also handles:
 * - Function parameter destructuring: ({ compact }) => → ({ isExpanded }) =>
 * - Callback second parameter: (node, compact) => → (node, isExpanded) =>
 */

const TARGET_JSX_COMPONENTS = new Set(['FooterItem', 'MobileLogo', 'Item']);

const RENDER_CALLBACK_PROPS = new Set(['renderFooter', 'collapseButtonWrapper']);

// Track identifiers that were renamed from 'compact' to 'isExpanded' in destructuring
const renamedIdentifiers = new Set<string>();

export default function transformer(file: FileInfo, api: API) {
    const j = api.jscodeshift;
    const root = j(file.source);

    // Clear tracking set for each file
    renamedIdentifiers.clear();

    // First pass: rename destructuring parameters and callback params
    // This also tracks renamed identifiers
    const hasDestructuringUpdate = updateDestructuringParams(root, j);
    const hasCallbackParamUpdate = updateCallbackSecondParam(root, j);

    // Second pass: update JSX props with awareness of renamed identifiers
    const hasJsxPropsUpdate = updateJsxProps(root, j);

    if (!hasJsxPropsUpdate && !hasDestructuringUpdate && !hasCallbackParamUpdate) {
        return null;
    }

    return root.toSource();
}

/**
 * Inverts a JSX expression value.
 * - true → false
 * - false → true
 * - someVar → !someVar
 * - !someVar → someVar
 * - (expression) → !(expression)
 */
function invertExpression(j: JSCodeshift, expr: any): any {
    // Handle literal booleans
    if (j.BooleanLiteral.check(expr) || j.Literal.check(expr)) {
        const value = expr.value;
        if (typeof value === 'boolean') {
            return j.booleanLiteral(!value);
        }
    }

    // Handle unary negation: !something → something
    if (j.UnaryExpression.check(expr) && expr.operator === '!') {
        return expr.argument;
    }

    // Handle identifiers and other expressions: something → !something
    return j.unaryExpression('!', expr);
}

/**
 * Update JSX props: compact → isExpanded with inverted value
 * Special handling: if value is an identifier that was renamed from destructuring,
 * just rename it without inversion.
 */
function updateJsxProps(root: Collection, j: JSCodeshift): boolean {
    let hasChanges = false;

    root.find(j.JSXAttribute, {
        name: {type: 'JSXIdentifier', name: 'compact'},
    }).forEach((path: ASTPath<JSXAttribute>) => {
        const jsxElement = path.parentPath.parentPath;

        // Check if this is on a target component
        if (jsxElement && j.JSXOpeningElement.check(jsxElement.node)) {
            const elementName = jsxElement.node.name;
            let componentName: string | null = null;

            if (j.JSXIdentifier.check(elementName)) {
                componentName = elementName.name;
            }

            // Only transform if it's a target component or if we can't determine
            if (componentName && !TARGET_JSX_COMPONENTS.has(componentName)) {
                return;
            }
        }

        const attrNode = path.node;
        const attrValue = attrNode.value;

        // Rename compact → isExpanded
        (attrNode.name as JSXIdentifier).name = 'isExpanded';

        if (attrValue === null) {
            // Shorthand: compact → isExpanded={false}
            attrNode.value = j.jsxExpressionContainer(j.booleanLiteral(false));
            hasChanges = true;
        } else if (j.JSXExpressionContainer.check(attrValue)) {
            const expr = attrValue.expression;

            if (!j.JSXEmptyExpression.check(expr)) {
                // Check if this is a simple identifier named 'compact'
                // that might be from a renamed destructuring parameter
                if (j.Identifier.check(expr) && expr.name === 'compact') {
                    // Just rename it to isExpanded (no inversion)
                    // This handles the case: compact={compact} → isExpanded={isExpanded}
                    attrValue.expression = j.identifier('isExpanded');
                } else {
                    // Invert the expression
                    attrValue.expression = invertExpression(j, expr);
                }
            }
            hasChanges = true;
        } else if (j.StringLiteral.check(attrValue)) {
            // Edge case: compact="true" or compact="false" (unusual but handle it)
            const strValue = attrValue.value;
            if (strValue === 'true') {
                attrNode.value = j.jsxExpressionContainer(j.booleanLiteral(false));
                hasChanges = true;
            } else if (strValue === 'false') {
                attrNode.value = j.jsxExpressionContainer(j.booleanLiteral(true));
                hasChanges = true;
            }
        }
    });

    return hasChanges;
}

/**
 * Update destructuring parameters in render callbacks:
 * renderFooter={({ compact }) => ...} → renderFooter={({ isExpanded }) => ...}
 */
function updateDestructuringParams(root: Collection, j: JSCodeshift): boolean {
    let hasChanges = false;

    // Find JSX attributes that are render callbacks
    root.find(j.JSXAttribute).forEach((attrPath: ASTPath<JSXAttribute>) => {
        const attrName = attrPath.node.name;
        if (!j.JSXIdentifier.check(attrName)) return;

        if (!RENDER_CALLBACK_PROPS.has(attrName.name)) return;

        const attrValue = attrPath.node.value;
        if (!j.JSXExpressionContainer.check(attrValue)) return;

        const expr = attrValue.expression;
        if (!j.ArrowFunctionExpression.check(expr) && !j.FunctionExpression.check(expr)) return;

        const funcExpr = expr as ArrowFunctionExpression | FunctionExpression;
        const params = funcExpr.params;

        // Look for destructuring pattern with 'compact'
        params.forEach((param) => {
            if (j.ObjectPattern.check(param)) {
                const objPattern = param as ObjectPattern;
                objPattern.properties.forEach((prop) => {
                    if (j.ObjectProperty.check(prop) || j.Property.check(prop)) {
                        const key = (prop as ObjectProperty).key;
                        if (j.Identifier.check(key) && key.name === 'compact') {
                            key.name = 'isExpanded';
                            hasChanges = true;
                            renamedIdentifiers.add('compact');

                            // Also update the value if it's a shorthand (compact → isExpanded)
                            const value = (prop as ObjectProperty).value;
                            if (j.Identifier.check(value) && value.name === 'compact') {
                                value.name = 'isExpanded';
                            }
                        }
                    }
                });
            }
        });
    });

    // Also find object properties that are render callbacks
    root.find(j.ObjectProperty).forEach((propPath: ASTPath<ObjectProperty>) => {
        const propKey = propPath.node.key;
        if (!j.Identifier.check(propKey)) return;

        if (!RENDER_CALLBACK_PROPS.has(propKey.name) && propKey.name !== 'wrapper') return;

        const propValue = propPath.node.value;
        if (!j.ArrowFunctionExpression.check(propValue) && !j.FunctionExpression.check(propValue))
            return;

        const funcExpr = propValue as ArrowFunctionExpression | FunctionExpression;
        const params = funcExpr.params;

        // Look for destructuring pattern with 'compact'
        params.forEach((param) => {
            if (j.ObjectPattern.check(param)) {
                const objPattern = param as ObjectPattern;
                objPattern.properties.forEach((prop) => {
                    if (j.ObjectProperty.check(prop) || j.Property.check(prop)) {
                        const key = (prop as ObjectProperty).key;
                        if (j.Identifier.check(key) && key.name === 'compact') {
                            key.name = 'isExpanded';
                            hasChanges = true;
                            renamedIdentifiers.add('compact');

                            const value = (prop as ObjectProperty).value;
                            if (j.Identifier.check(value) && value.name === 'compact') {
                                value.name = 'isExpanded';
                            }
                        }
                    }
                });
            }
        });
    });

    return hasChanges;
}

/**
 * Update callback second parameter:
 * wrapper: (node, compact) => ... → wrapper: (node, isExpanded) => ...
 */
function updateCallbackSecondParam(root: Collection, j: JSCodeshift): boolean {
    let hasChanges = false;

    // Find 'wrapper' property in objects (e.g., logo={{ wrapper: (node, compact) => ... }})
    root.find(j.ObjectProperty, {
        key: {type: 'Identifier', name: 'wrapper'},
    }).forEach((propPath: ASTPath<ObjectProperty>) => {
        const propValue = propPath.node.value;

        if (!j.ArrowFunctionExpression.check(propValue) && !j.FunctionExpression.check(propValue)) {
            return;
        }

        const funcExpr = propValue as ArrowFunctionExpression | FunctionExpression;
        const params = funcExpr.params;

        // Check if second parameter is 'compact'
        if (params.length >= 2) {
            const secondParam = params[1];
            if (j.Identifier.check(secondParam) && secondParam.name === 'compact') {
                secondParam.name = 'isExpanded';
                hasChanges = true;
                renamedIdentifiers.add('compact');
            }
        }
    });

    return hasChanges;
}
