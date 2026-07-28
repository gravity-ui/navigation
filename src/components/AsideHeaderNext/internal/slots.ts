import * as React from 'react';

export type SlotName = 'header' | 'menu' | 'footer' | 'content' | 'alert' | 'background' | 'panels';

const SLOT = Symbol('AsideHeaderNext.slot');

type WithSlot = {[SLOT]?: SlotName};

/** Tags a component with the layout slot it belongs to (used by the slots layout mode). */
export function withSlot<C extends React.ElementType>(Component: C, slot: SlotName): C {
    // eslint-disable-next-line no-param-reassign
    (Component as WithSlot)[SLOT] = slot;
    return Component;
}

function getSlot(child: React.ReactNode): SlotName | undefined {
    if (!React.isValidElement(child)) {
        return undefined;
    }
    return (child.type as WithSlot)[SLOT];
}

export type CollectedSlots = Record<SlotName, React.ReactNode[]>;

/**
 * Distributes direct children into slot buckets by their `withSlot` tag.
 * Children that are not tagged (or not direct elements) are reported in `unknown`.
 */
export function collectSlots(children: React.ReactNode): {
    slots: CollectedSlots;
    unknown: React.ReactNode[];
} {
    const slots: CollectedSlots = {
        header: [],
        menu: [],
        footer: [],
        content: [],
        alert: [],
        background: [],
        panels: [],
    };
    const unknown: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
        if (child === null || child === undefined || child === false) {
            return;
        }
        const slot = getSlot(child);
        if (slot) {
            slots[slot].push(child);
        } else {
            unknown.push(child);
        }
    });

    return {slots, unknown};
}
