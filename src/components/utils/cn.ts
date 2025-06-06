import {withNaming} from '@bem-react/classname';

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
export const createBlock = (blockName: string, styles: Record<string, string>) => {
    const bemBlock = withNaming({n: NAMESPACE, e: '__', m: '_'});
    const blockFn = bemBlock(blockName);

    // Create a function with the same signature as the original block function
    function cssModuleBlock(): string;
    function cssModuleBlock(mods?: CnMods | null, mix?: string | string[] | undefined): string;
    function cssModuleBlock(elemName: string, elemMix?: string | string[] | undefined): string;
    function cssModuleBlock(
        elemName: string,
        elemMods?: CnMods | null,
        elemMix?: string | string[] | undefined,
    ): string;
    function cssModuleBlock(
        elemOrMods?: string | CnMods | null,
        elemModsOrBlockMix?: CnMods | string | string[] | null | undefined,
        elemMix?: string | string[] | undefined,
    ): string {
        // Call the original block function with the same arguments
        const className = blockFn(elemOrMods as any, elemModsOrBlockMix as any, elemMix as any);

        // For CSS modules, we need to map the generated class name to the actual CSS module class
        // Since we're using [local] as the generateScopedName, the class names should match
        return styles[className] || className;
    }

    return cssModuleBlock;
};
