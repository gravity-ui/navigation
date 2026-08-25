import * as React from 'react';

export type LayoutMode = 'slots' | 'manual';

export interface LayoutContextValue {
    compact: boolean;
    size: number;
    layout: LayoutMode;
    setCompact: (compact: boolean) => void;
    /** DOM node next to the rail where `Panel.Content` is portaled. */
    panelContainer: HTMLElement | null;
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

/** Public hook: "is the rail collapsed right now". */
export function useAsideHeaderCompact(): boolean {
    return useLayoutContext().compact;
}

export type ItemPlace = 'header' | 'menu' | 'footer' | 'popup';
export type KeyboardMode = 'tab' | 'roving';

/**
 * Defaults an `ItemList` gives to its rows. `place` only feeds `data-place`
 * (i.e. CSS); `keyboard` decides whether rows join a roving tabindex scope.
 */
export interface ItemListContextValue {
    place: ItemPlace;
    iconSize?: number;
    keyboard: KeyboardMode;
}

const ItemListContext = React.createContext<ItemListContextValue>({
    place: 'menu',
    keyboard: 'tab',
});

export const ItemListProvider = ItemListContext.Provider;

export function useItemListContext(): ItemListContextValue {
    return React.useContext(ItemListContext);
}
