import * as React from 'react';

import {useCompositeContext} from './CompositeContext';

export interface UseCompositeItemReturn {
    /** Ref to attach to the focusable item element. */
    ref: React.RefCallback<HTMLElement>;
    index: number;
    isActive: boolean;
    /** Props to spread on the focusable item element (roving tabindex + focus sync). */
    props: {
        tabIndex: number;
        onFocus: () => void;
    };
}

/**
 * Registers an item with the parent {@link Composite} and returns roving
 * tabindex props. The active item is the single tab stop.
 */
export function useCompositeItem(): UseCompositeItemReturn {
    const {register, unregister, getIndex, activeIndex, setActiveIndex} = useCompositeContext();

    const nodeRef = React.useRef<HTMLElement | null>(null);
    const [index, setIndex] = React.useState(-1);

    const ref = React.useCallback<React.RefCallback<HTMLElement>>(
        (node) => {
            nodeRef.current = node;
            if (node) {
                register(node);
                setIndex(getIndex(node));
            }
            return () => {
                if (node) {
                    unregister(node);
                }
            };
        },
        [register, unregister, getIndex],
    );

    const isActive = index === activeIndex;

    const onFocus = React.useCallback(() => {
        if (index >= 0) {
            setActiveIndex(index);
        }
    }, [index, setActiveIndex]);

    return {
        ref,
        index,
        isActive,
        props: {
            tabIndex: isActive || activeIndex < 0 ? 0 : -1,
            onFocus,
        },
    };
}
