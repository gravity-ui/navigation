import * as React from 'react';

import {useCompositeContext} from './CompositeContext';

export interface UseCompositeItemReturn {
    /** Ref to attach to the focusable item element (no-op when disabled). */
    ref: React.RefCallback<HTMLElement> | undefined;
    index: number;
    isActive: boolean;
    /** Roving tabindex props; empty when there is no composite scope around. */
    props: {tabIndex?: number; onFocus?: () => void; 'data-highlighted'?: true};
}

const EMPTY: UseCompositeItemReturn = {ref: undefined, index: -1, isActive: false, props: {}};

/**
 * Registers the row with the enclosing {@link Composite}, if there is one.
 *
 * Returns a no-op result when the row is outside a composite scope (the rail
 * uses plain Tab order) or when `enabled` is false — so `Item` does not need to
 * branch on where it is rendered.
 */
export function useCompositeItem(enabled = true): UseCompositeItemReturn {
    const ctx = useCompositeContext();
    const active = Boolean(ctx) && enabled;

    const nodeRef = React.useRef<HTMLElement | null>(null);
    const [index, setIndex] = React.useState(-1);

    const register = ctx?.register;
    const unregister = ctx?.unregister;
    const getIndex = ctx?.getIndex;
    const setActiveIndex = ctx?.setActiveIndex;
    const activeIndex = ctx?.activeIndex ?? -1;

    const ref = React.useCallback<React.RefCallback<HTMLElement>>(
        (node) => {
            nodeRef.current = node;
            if (node && register && getIndex) {
                register(node);
                setIndex(getIndex(node));
            }
            return () => {
                if (node && unregister) {
                    unregister(node);
                }
            };
        },
        [register, unregister, getIndex],
    );

    const isActive = index === activeIndex;

    const onFocus = React.useCallback(() => {
        if (index >= 0) {
            setActiveIndex?.(index);
        }
    }, [index, setActiveIndex]);

    if (!active) {
        return EMPTY;
    }

    return {
        ref,
        index,
        isActive,
        props: {
            tabIndex: isActive || activeIndex < 0 ? 0 : -1,
            onFocus,
            'data-highlighted': isActive || undefined,
        },
    };
}
