import {ASTPath, JSCodeshift, VariableDeclarator} from 'jscodeshift';

export function getDeclaratorNode(path: ASTPath, j: JSCodeshift): VariableDeclarator | null {
    let declaratorNode: VariableDeclarator | null = null;
    let currentPath = path;

    while (currentPath && !declaratorNode) {
        if (j.VariableDeclarator.check(currentPath.node)) {
            declaratorNode = currentPath.node;
        }
        currentPath = currentPath.parentPath;
    }

    return declaratorNode;
}
