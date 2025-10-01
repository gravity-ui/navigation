import type {
    API,
    ASTPath,
    Collection,
    FileInfo,
    JSCodeshift,
    MemberExpression,
    ObjectExpression,
    ObjectProperty,
    RestElement,
    SpreadElement,
    TSPropertySignature,
    VariableDeclarator,
} from 'jscodeshift';

import {checkIsTargetType} from '../utils/checkIsTargetType';
import {getDeclaratorNode} from '../utils/getDeclaratorNode';
import {getGravityTypeMap} from '../utils/getGravityTypeMap';

function isStructurallyTargetObject(node: ObjectExpression): boolean {
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
        (properties.has('compact') ||
            properties.has('link') ||
            properties.has('enableTooltip') ||
            properties.has('onItemClick') ||
            properties.has('bringForward'))
    );
}

function replaceLinkWithHref(path: ASTPath<ObjectProperty | TSPropertySignature>, j: JSCodeshift) {
    const propertyNode = path.node;
    if (propertyNode.key.type === 'Identifier' && propertyNode.key.name === 'link') {
        j(path.get('key')).replaceWith(j.identifier('href'));

        return true;
    }

    return false;
}

export default function transformer(file: FileInfo, api: API) {
    const j = api.jscodeshift;
    const root = j(file.source);

    const hasObjectPropertiesUpdate = updateObjectProperties(root, j);
    const hasMemberExpressionsUpdate = updateMemberExpressions(root, j);

    if (!hasObjectPropertiesUpdate && !hasMemberExpressionsUpdate) {
        return null;
    }

    return root.toSource();
}

function updateObjectProperties(root: Collection, j: JSCodeshift) {
    const gravityTypeMap = getGravityTypeMap(root, j);

    let hasChanges = false;
    root.find<ObjectProperty>(j.ObjectProperty, {
        key: {type: 'Identifier', name: 'link'},
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
            if (replaceLinkWithHref(path, j)) {
                hasChanges = true;
            }
        });

    return hasChanges;
}

function updateMemberExpressions(root: Collection, j: JSCodeshift) {
    const gravityTypeMap = getGravityTypeMap(root, j);

    let hasChanges = false;
    root.find<MemberExpression>(j.MemberExpression, {
        property: {type: 'Identifier', name: 'link'},
    }).forEach((path) => {
        let baseObject = path.node.object;

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

        isTarget = checkIsTargetType(declaratorNode, j, gravityTypeMap).isTarget;

        if (!isTarget && declaratorNode && declaratorNode.init) {
            let init: VariableDeclarator['init'] | SpreadElement | RestElement | null =
                declaratorNode.init;
            if (j.ArrayExpression.check(declaratorNode.init)) {
                init = declaratorNode.init.elements[0];
            }

            if (j.ObjectExpression.check(init) && isStructurallyTargetObject(init)) {
                isTarget = true;
            }
        }

        if (isTarget) {
            j(path.get('property')).replaceWith(j.identifier('href'));
            hasChanges = true;
        }
    });

    return hasChanges;
}
