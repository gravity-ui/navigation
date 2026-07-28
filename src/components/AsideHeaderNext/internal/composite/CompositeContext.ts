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

export function useCompositeContext(): CompositeContextValue {
    const ctx = React.useContext(CompositeContext);
    if (!ctx) {
        throw new Error('Composite parts must be used within <Composite>.');
    }
    return ctx;
}
