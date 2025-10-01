import {Collection, ImportDeclaration, JSCodeshift} from 'jscodeshift';

const PACKAGE_SOURCE = '@gravity-ui/navigation';

export function getGravityTypeMap(
    root: Collection,
    j: JSCodeshift,
    type: 'local-to-gravity' | 'gravity-to-local' = 'local-to-gravity',
): Map<string, string> {
    const gravityTypeMap = new Map<string, string>();
    root.find<ImportDeclaration>(j.ImportDeclaration, {source: {value: PACKAGE_SOURCE}}).forEach(
        (path) => {
            path.node.specifiers?.forEach((spec) => {
                if (spec.type === 'ImportSpecifier') {
                    const localName = spec.local ? spec.local.name : spec.imported.name;
                    gravityTypeMap.set(
                        type === 'local-to-gravity' ? localName : spec.imported.name,
                        type === 'local-to-gravity' ? spec.imported.name : localName,
                    );
                }
            });
        },
    );

    return gravityTypeMap;
}
