import * as React from 'react';

export type OverlayKind = 'popup' | 'panel';

/**
 * Local link between an overlay (`Popup` / `Panel`) and its own `Trigger`.
 *
 * Deliberately not a global `id -> open` registry: the overlay is declared next
 * to its trigger, so the trigger just reads the nearest provider.
 */
export interface OverlayContextValue {
    kind: OverlayKind;
    open: boolean;
    setOpen: (open: boolean) => void;
    triggerId: string;
    contentId: string;
    anchor: HTMLElement | null;
    setAnchor: (node: HTMLElement | null) => void;
    /** Hover intent handlers; no-ops for click-triggered overlays. */
    onPointerEnter: () => void;
    onPointerLeave: () => void;
}

const OverlayContext = React.createContext<OverlayContextValue | null>(null);

export const OverlayProvider = OverlayContext.Provider;

export function useOverlayContext(part: string): OverlayContextValue {
    const ctx = React.useContext(OverlayContext);
    if (!ctx) {
        throw new Error(`<${part}> must be used inside its overlay component.`);
    }
    return ctx;
}

/** Present when this overlay is nested inside another one. */
export function useParentOverlay(): OverlayContextValue | null {
    return React.useContext(OverlayContext);
}
