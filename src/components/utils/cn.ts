import {
    type ClassNameFormatter,
    type ClassNameList,
    type NoStrictEntityMods,
    withNaming,
} from '@bem-react/classname';

export const NAMESPACE = 'gn-';

export const cn = withNaming({e: '__', m: '_'});
export const block = withNaming({n: NAMESPACE, e: '__', m: '_'});

export type CnBlock = ReturnType<typeof cn>;

/**
 * Creates a BEM block function that works with CSS modules
 * @param blockName - The block name (without namespace)
 * @param styles - CSS modules object
 * @returns A function that generates class names from the CSS modules object
 */
// Type guards to help distinguish between different argument patterns
const isString = (value: unknown): value is string => typeof value === 'string';
const isMods = (value: unknown): value is NoStrictEntityMods =>
    typeof value === 'object' && value !== null && !Array.isArray(value);
const isMix = (value: unknown): value is ClassNameList =>
    typeof value === 'string' || Array.isArray(value);

export const createBlock = (blockName: string, styles: Record<string, string>) => {
    const bemBlock = withNaming({n: NAMESPACE, e: '__', m: '_'});
    const blockFn: ClassNameFormatter = bemBlock(blockName);

    // Create a function with the same signature as the original block function
    function cssModuleBlock(): string;
    function cssModuleBlock(
        mods?: NoStrictEntityMods | null,
        mix?: string | string[] | undefined,
    ): string;
    function cssModuleBlock(elemName: string, elemMix?: string | string[] | undefined): string;
    function cssModuleBlock(
        elemName: string,
        elemMods?: NoStrictEntityMods | null,
        elemMix?: string | string[] | undefined,
    ): string;
    function cssModuleBlock(
        elemOrMods?: string | NoStrictEntityMods | null,
        elemModsOrBlockMix?: NoStrictEntityMods | string | string[] | null | undefined,
        elemMix?: string | string[] | undefined,
    ): string {
        // Type-safe calls to blockFn based on argument patterns
        let className: string;

        if (elemOrMods === undefined) {
            // Case 1: blockFn()
            className = blockFn();
        } else if (isString(elemOrMods)) {
            // Element-related cases
            if (elemModsOrBlockMix === undefined && elemMix === undefined) {
                // Case 2: blockFn(elemName)
                className = blockFn(elemOrMods);
            } else if (
                elemMix === undefined &&
                (elemModsOrBlockMix === null || isMods(elemModsOrBlockMix))
            ) {
                // Case 3: blockFn(elemName, elemMods)
                className = blockFn(elemOrMods, elemModsOrBlockMix, undefined);
            } else if (isMix(elemModsOrBlockMix) && elemMix === undefined) {
                // Case 4: blockFn(elemName, elemMix)
                className = blockFn(elemOrMods, elemModsOrBlockMix);
            } else {
                // Case 5: blockFn(elemName, elemMods, elemMix)
                className = blockFn(
                    elemOrMods,
                    elemModsOrBlockMix === null || isMods(elemModsOrBlockMix)
                        ? elemModsOrBlockMix
                        : null,
                    elemMix,
                );
            }
        } else if (elemModsOrBlockMix === undefined) {
            // Case 6: blockFn(mods)
            className = blockFn(elemOrMods);
        } else {
            // Case 7: blockFn(mods, mix)
            className = blockFn(elemOrMods, elemModsOrBlockMix as ClassNameList);
        }

        // Handle case where styles object is undefined (e.g., in Storybook without CSS modules)
        if (!styles || typeof styles !== 'object') {
            return className;
        }

        // For CSS modules, we need to map EACH class token separately,
        // since blockFn can return multiple classes in a single string
        return className
            .split(/\s+/)
            .filter(Boolean)
            .map((token) => styles[token] || token)
            .join(' ');
    }

    return cssModuleBlock;
};
