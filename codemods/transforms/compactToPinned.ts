/* eslint-disable no-param-reassign */
import {execSync} from 'child_process';

import type {
    API,
    ASTPath,
    Collection,
    FileInfo,
    JSCodeshift,
    JSXAttribute,
    JSXIdentifier,
} from 'jscodeshift';

/**
 * Codemod to transform AsideHeader/PageLayout `compact` → `pinned` and `onChangeCompact` → `onChangePinned`.
 *
 * Only applies to JSX elements: AsideHeader, PageLayout.
 *
 * Transformations:
 * - compact={true} → pinned={false}
 * - compact={false} → pinned={true}
 * - compact (shorthand) → pinned={false}
 * - compact={someVar} → pinned={!someVar}
 * - onChangeCompact={fn} → onChangePinned={fn} (rename only, callback now receives pinned)
 */

const LAYOUT_JSX_COMPONENTS = new Set(['AsideHeader', 'PageLayout']);

function isLayoutComponent(path: ASTPath<JSXAttribute>, j: JSCodeshift): boolean {
    const openingElement = path.parentPath?.node;
    if (!openingElement || !j.JSXOpeningElement.check(openingElement)) {
        return false;
    }
    const name = openingElement.name;
    if (!j.JSXIdentifier.check(name)) {
        return false;
    }
    return LAYOUT_JSX_COMPONENTS.has(name.name);
}

/**
 * Inverts a JSX expression value.
 */
function invertExpression(j: JSCodeshift, expr: any): any {
    if (j.BooleanLiteral.check(expr) || j.Literal.check(expr)) {
        const value = expr.value;
        if (typeof value === 'boolean') {
            expr.value = !value;
            return expr;
        }
    }
    if (j.UnaryExpression.check(expr) && expr.operator === '!') {
        return expr.argument;
    }
    return j.unaryExpression('!', expr);
}

function updateCompactToPinned(root: Collection, j: JSCodeshift): boolean {
    let hasChanges = false;

    root.find(j.JSXAttribute, {name: {type: 'JSXIdentifier', name: 'compact'}}).forEach(
        (path: ASTPath<JSXAttribute>) => {
            if (!isLayoutComponent(path, j)) {
                return;
            }

            const attrNode = path.node;
            const attrValue = attrNode.value;

            (attrNode.name as JSXIdentifier).name = 'pinned';

            if (attrValue === null) {
                attrNode.value = j.jsxExpressionContainer(j.booleanLiteral(false));
                hasChanges = true;
            } else if (j.JSXExpressionContainer.check(attrValue)) {
                const expr = attrValue.expression;
                if (!j.JSXEmptyExpression.check(expr)) {
                    attrValue.expression = invertExpression(j, expr);
                }
                hasChanges = true;
            } else if (j.StringLiteral.check(attrValue)) {
                if (attrValue.value === 'true') {
                    attrNode.value = j.jsxExpressionContainer(j.booleanLiteral(false));
                } else if (attrValue.value === 'false') {
                    attrNode.value = j.jsxExpressionContainer(j.booleanLiteral(true));
                }
                hasChanges = true;
            }
        },
    );

    return hasChanges;
}

function updateOnChangeCompactToOnChangePinned(root: Collection, j: JSCodeshift): boolean {
    let hasChanges = false;

    root.find(j.JSXAttribute, {
        name: {type: 'JSXIdentifier', name: 'onChangeCompact'},
    }).forEach((path: ASTPath<JSXAttribute>) => {
        if (!isLayoutComponent(path, j)) {
            return;
        }
        (path.node.name as JSXIdentifier).name = 'onChangePinned';
        hasChanges = true;
    });

    return hasChanges;
}

export default function transformer(file: FileInfo, api: API) {
    const j = api.jscodeshift;
    const root = j(file.source);

    const hasCompactUpdate = updateCompactToPinned(root, j);
    const hasOnChangeUpdate = updateOnChangeCompactToOnChangePinned(root, j);

    if (!hasCompactUpdate && !hasOnChangeUpdate) {
        return null;
    }

    const output = root.toSource();

    try {
        const formatted = execSync('prettier --parser typescript', {
            input: output,
            encoding: 'utf-8',
            maxBuffer: 10 * 1024 * 1024,
            stdio: ['pipe', 'pipe', 'pipe'],
        });
        return formatted;
    } catch {
        return output;
    }
}
