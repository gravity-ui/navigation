import * as React from 'react';

export type CompositeOrientation = 'vertical' | 'horizontal';

export interface CompositeContextValue {
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    orientation: CompositeOrientation;
    loop: boolean;
    register: (node: HTMLElement) => void;
    unregister: (node: HTMLElement) => void;
    /** DOM-ordered index of a registered node (or -1). */
    getIndex: (node: HTMLElement) => number;
}

export const CompositeContext = React.createContext<CompositeContextValue | null>(null);

/**
 * Nullable on purpose: rows outside a composite scope (the rail, which uses
 * plain Tab order) must render normally instead of throwing.
 */
export function useCompositeContext(): CompositeContextValue | null {
    return React.useContext(CompositeContext);
}
