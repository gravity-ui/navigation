import type {API, FileInfo, Options} from 'jscodeshift';

import linkToHref from './linkToHref';
import unifyInterfaces from './unifyInterfaces';

export default function transform(file: FileInfo, api: API, options: Options) {
    let source = file.source;
    let hasChanges = false;

    const transforms = [
        {name: 'unify-interfaces', transform: unifyInterfaces},
        {name: 'link-to-href', transform: linkToHref},
    ];

    for (const {name, transform: transformFn} of transforms) {
        try {
            const result = transformFn({source, path: file.path}, api);
            if (result && result !== source) {
                source = result;
                hasChanges = true;

                if (options && options.verbose) {
                    console.log(`✓ Applied ${name}`);
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error applying ${name}:`, errorMessage);
            if (options && options.verbose && error instanceof Error) {
                console.error(error.stack);
            }
        }
    }

    return hasChanges ? source : null;
}
