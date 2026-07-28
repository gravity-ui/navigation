import * as React from 'react';

export type LayoutMode = 'slots' | 'manual';

export interface LayoutContextValue {
    compact: boolean;
    size: number;
    layout: LayoutMode;
    setCompact: (compact: boolean) => void;
}

const LayoutContext = React.createContext<LayoutContextValue | null>(null);

export const LayoutProvider = LayoutContext.Provider;

export function useLayoutContext(): LayoutContextValue {
    const ctx = React.useContext(LayoutContext);
    if (!ctx) {
        throw new Error('AsideHeaderNext parts must be used within <AsideHeaderNext.Root>.');
    }
    return ctx;
}

/** Defaults for an `Item`, provided by its container (e.g. footer icon size). */
export interface ItemDefaults {
    iconSize?: number;
    place: 'header' | 'menu' | 'footer' | 'popup';
}

const ItemDefaultsContext = React.createContext<ItemDefaults>({place: 'menu'});

export const ItemDefaultsProvider = ItemDefaultsContext.Provider;

export function useItemDefaults(): ItemDefaults {
    return React.useContext(ItemDefaultsContext);
}
