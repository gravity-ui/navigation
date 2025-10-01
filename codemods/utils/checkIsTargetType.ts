import {JSCodeshift, VariableDeclarator} from 'jscodeshift';

const DEFAULT_TARGET_TYPES = new Set(['FooterItem', 'AsideHeaderItem']);

export function checkIsTargetType(
    declaratorNode: VariableDeclarator | null,
    j: JSCodeshift,
    gravityTypeMap: Map<string, string>,
    targetTypes: Set<string> = DEFAULT_TARGET_TYPES,
) {
    let localTypeName: string | null = null;
    let isArray = false;
    let isTarget = false;

    if (
        declaratorNode &&
        j.Identifier.check(declaratorNode.id) &&
        declaratorNode.id.typeAnnotation
    ) {
        const typeNode = declaratorNode.id.typeAnnotation.typeAnnotation;

        if (j.TSTypeReference.check(typeNode) && j.Identifier.check(typeNode.typeName)) {
            localTypeName = typeNode.typeName.name;
        }

        if (
            j.TSArrayType.check(typeNode) &&
            j.TSTypeReference.check(typeNode.elementType) &&
            j.Identifier.check(typeNode.elementType.typeName)
        ) {
            localTypeName = typeNode.elementType.typeName.name;
            isArray = true;
        }

        if (localTypeName) {
            const originalTypeName = gravityTypeMap.get(localTypeName);
            if (originalTypeName && targetTypes.has(originalTypeName)) {
                isTarget = true;
            }
        }
    }

    return {isTarget, isArray};
}
