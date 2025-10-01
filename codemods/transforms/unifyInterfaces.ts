/* eslint-disable max-depth */
import type {
    API,
    Collection,
    FileInfo,
    ImportDeclaration,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    ImportSpecifier,
    JSCodeshift,
    MemberExpression,
    ObjectExpression,
    ObjectProperty,
    RestElement,
    SpreadElement,
    TSTypeReference,
    VariableDeclarator,
} from 'jscodeshift';

import {checkIsTargetType} from '../utils/checkIsTargetType';
import {getDeclaratorNode} from '../utils/getDeclaratorNode';
import {getGravityTypeMap} from '../utils/getGravityTypeMap';

const PACKAGE_SOURCE = '@gravity-ui/navigation';

const TYPES_TO_RENAME = new Map([
    ['SubheaderMenuItem', 'AsideHeaderItem'],
    ['CompositeBarItem', 'AsideHeaderItem'],
]);

function isStructurallyTargetObject(node: ObjectExpression): boolean {
    const properties = new Set(
        node.properties
            .map((p) =>
                p.type === 'ObjectProperty' && p.key.type === 'Identifier' ? p.key.name : null,
            )
            .filter(Boolean),
    );

    return (
        properties.has('item') &&
        (properties.has('enableTooltip') ||
            properties.has('bringForward') ||
            properties.has('compact') ||
            properties.has('order'))
    );
}

function isStructurallyTargetFlatObject(node: ObjectExpression): boolean {
    const properties = new Set(
        node.properties
            .map((p) =>
                p.type === 'ObjectProperty' && p.key.type === 'Identifier' ? p.key.name : null,
            )
            .filter(Boolean),
    );

    return (
        properties.has('id') &&
        properties.has('title') &&
        (properties.has('enableTooltip') ||
            properties.has('bringForward') ||
            properties.has('compact'))
    );
}

export default function transformer(file: FileInfo, api: API) {
    const j = api.jscodeshift;
    const root = j(file.source);

    const hasImportsUpdate = updateImports(root, j);
    const hasTypesUsageUpdate = updateTypesUsage(root, j);
    const hasFlatStructUpdate = updateFlatStruct(root, j);
    const hasMemberExpressionsUpdate = updateMemberExpressions(root, j);

    if (
        !hasImportsUpdate &&
        !hasTypesUsageUpdate &&
        !hasFlatStructUpdate &&
        !hasMemberExpressionsUpdate
    ) {
        return undefined;
    }

    return root.toSource();
}

function updateImports(root: Collection, j: JSCodeshift): boolean {
    const gravityTypeMap = getGravityTypeMap(root, j);

    if (gravityTypeMap.size === 0) {
        return false;
    }

    let hasChanges = false;
    root.find<ImportDeclaration>(j.ImportDeclaration, {source: {value: PACKAGE_SOURCE}}).forEach(
        (path) => {
            let hasBeenModified = false;
            const newSpecifiers: (
                | ImportSpecifier
                | ImportDefaultSpecifier
                | ImportNamespaceSpecifier
            )[] = [];
            const addedSpecifiers = new Set<string>(); // отслеживаем уже добавленные имена

            path.node.specifiers?.forEach((spec) => {
                if (spec.type === 'ImportSpecifier' && TYPES_TO_RENAME.has(spec.imported.name)) {
                    const newTypeName = TYPES_TO_RENAME.get(spec.imported.name);
                    if (!newTypeName) return;

                    if (!addedSpecifiers.has(newTypeName)) {
                        newSpecifiers.push(
                            j.importSpecifier(
                                j.identifier(newTypeName),
                                spec.local?.name === spec.imported.name ? null : spec.local,
                            ),
                        );
                        addedSpecifiers.add(newTypeName);
                        hasBeenModified = true;
                    }
                } else if (spec.type === 'ImportSpecifier') {
                    if (!addedSpecifiers.has(spec.imported.name)) {
                        newSpecifiers.push(spec);
                        addedSpecifiers.add(spec.imported.name);
                    }
                } else {
                    newSpecifiers.push(spec);
                }
            });

            if (hasBeenModified) {
                path.node.specifiers = newSpecifiers;
                hasChanges = true;
            }
        },
    );

    return hasChanges;
}

function updateTypesUsage(root: Collection, j: JSCodeshift): boolean {
    const gravityTypeMap = getGravityTypeMap(root, j, 'gravity-to-local');

    if (gravityTypeMap.size === 0) {
        return false;
    }

    let hasChanges = false;
    root.find<TSTypeReference>(j.TSTypeReference).forEach((path) => {
        const typeNameNode = path.node.typeName;
        if (typeNameNode.type !== 'Identifier') return;

        const localTypeName = typeNameNode.name;

        if (TYPES_TO_RENAME.has(localTypeName)) {
            const hasRenameTypeName = gravityTypeMap.has(TYPES_TO_RENAME.get(localTypeName) ?? '');

            if (hasRenameTypeName) {
                const renameTypeName = gravityTypeMap.get(TYPES_TO_RENAME.get(localTypeName) ?? '');
                if (!renameTypeName) return;

                j(path.get('typeName')).replaceWith(j.identifier(renameTypeName));
                hasChanges = true;
            }
        }
    });

    return hasChanges;
}

function updateFlatStruct(root: Collection, j: JSCodeshift): boolean {
    const gravityTypeMap = getGravityTypeMap(root, j);

    let hasChanges = false;
    root.find<ObjectProperty>(j.ObjectProperty, {
        key: {name: 'item'},
        value: {type: 'ObjectExpression'},
    })
        .filter((path) => {
            const parentObject = path.parentPath.node;
            if (parentObject.type !== 'ObjectExpression') return false;

            const declaratorNode = getDeclaratorNode(path.parentPath, j);

            if (checkIsTargetType(declaratorNode, j, gravityTypeMap).isTarget) {
                return true;
            }

            if (isStructurallyTargetObject(parentObject)) {
                return true;
            }

            return false;
        })
        .forEach((path) => {
            const outerObjectPath = path.parentPath;
            const innerProperties = (path.node.value as ObjectExpression).properties;
            const outerProperties = (outerObjectPath.node as ObjectExpression).properties;
            const filteredOuterProperties = outerProperties.filter((p) => p !== path.node);

            // Flatten: merge inner properties into outer object, remove item wrapper
            const allProperties = [...innerProperties, ...filteredOuterProperties];

            outerObjectPath.node.properties = allProperties;

            hasChanges = true;
        });

    return hasChanges;
}

function updateMemberExpressions(root: Collection, j: JSCodeshift): boolean {
    const gravityTypeMap = getGravityTypeMap(root, j);

    let hasChanges = false;
    root.find<MemberExpression>(j.MemberExpression, {
        property: {type: 'Identifier', name: 'item'},
    })
        .filter((path) => j.MemberExpression.check(path.parentPath.node))
        // eslint-disable-next-line complexity
        .forEach((path) => {
            let baseObject = path.node.object;
            let isArray = false;

            if (j.MemberExpression.check(baseObject)) {
                baseObject = baseObject.object;
            }

            if (!j.Identifier.check(baseObject)) return;

            const scope = path.scope.lookup(baseObject.name);
            if (!scope) return;

            const bindings = scope.getBindings()[baseObject.name];
            if (!bindings || !bindings.length) return;

            const bindingPath = bindings[0];
            let isTarget = false;

            const declaratorNode = getDeclaratorNode(bindingPath, j);

            const checkResult = checkIsTargetType(declaratorNode, j, gravityTypeMap);
            isTarget = checkResult.isTarget;
            isArray = checkResult.isArray;

            if (!isTarget && declaratorNode && declaratorNode.init) {
                let init: VariableDeclarator['init'] | SpreadElement | RestElement | null =
                    declaratorNode.init;
                if (j.ArrayExpression.check(declaratorNode.init)) {
                    init = declaratorNode.init.elements[0];
                    isArray = true;
                }

                if (j.ObjectExpression.check(init) && isStructurallyTargetFlatObject(init)) {
                    isTarget = true;
                }
            }

            if (isTarget) {
                // Remove .item from member expression chains
                // headerItem.item.title -> headerItem.title
                const newExpression = j.memberExpression(
                    isArray ? path.node.object : baseObject,
                    path.parentPath.node.property,
                );

                j(path.parentPath).replaceWith(newExpression);
                hasChanges = true;
            }
        });

    return hasChanges;
}
