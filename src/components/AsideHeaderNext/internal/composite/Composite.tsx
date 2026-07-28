import * as React from 'react';

import {RenderProp, useRenderElement} from '../useRenderElement';

import {CompositeContext, CompositeContextValue, CompositeOrientation} from './CompositeContext';

export interface CompositeProps {
    children?: React.ReactNode;
    className?: string;
    orientation?: CompositeOrientation;
    loop?: boolean;
    defaultActiveIndex?: number;
    activeIndex?: number;
    onActiveIndexChange?: (index: number) => void;
    render?: RenderProp;
    ref?: React.Ref<HTMLDivElement>;
    [key: string]: unknown;
}

const sortByDomOrder = (nodes: Set<HTMLElement>): HTMLElement[] =>
    Array.from(nodes).sort((a, b) => {
        const position = a.compareDocumentPosition(b);
        // eslint-disable-next-line no-bitwise
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
            return -1;
        }
        // eslint-disable-next-line no-bitwise
        if (position & Node.DOCUMENT_POSITION_PRECEDING) {
            return 1;
        }
        return 0;
    });

/**
 * Minimal composite root: roving tabindex + arrow / Home / End navigation over
 * registered items. Replaces the UIKit `List` keyboard handling for the menu.
 */
export function Composite(props: CompositeProps) {
    const {
        children,
        orientation = 'vertical',
        loop = true,
        defaultActiveIndex = 0,
        activeIndex: controlledActiveIndex,
        onActiveIndexChange,
        render,
        ref,
        onKeyDown,
        ...elementProps
    } = props;

    const [uncontrolledActiveIndex, setUncontrolledActiveIndex] =
        React.useState(defaultActiveIndex);
    const activeIndex = controlledActiveIndex ?? uncontrolledActiveIndex;

    const setActiveIndex = React.useCallback(
        (index: number) => {
            if (controlledActiveIndex === undefined) {
                setUncontrolledActiveIndex(index);
            }
            onActiveIndexChange?.(index);
        },
        [controlledActiveIndex, onActiveIndexChange],
    );

    const nodesRef = React.useRef<Set<HTMLElement>>(new Set());

    const register = React.useCallback((node: HTMLElement) => {
        nodesRef.current.add(node);
    }, []);

    const unregister = React.useCallback((node: HTMLElement) => {
        nodesRef.current.delete(node);
    }, []);

    const getIndex = React.useCallback(
        (node: HTMLElement) => sortByDomOrder(nodesRef.current).indexOf(node),
        [],
    );

    const focusByIndex = React.useCallback(
        (index: number) => {
            const sorted = sortByDomOrder(nodesRef.current);
            const target = sorted[index];
            if (target) {
                setActiveIndex(index);
                target.focus();
            }
        },
        [setActiveIndex],
    );

    const handleKeyDown = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            const count = nodesRef.current.size;
            if (count === 0) {
                return;
            }

            const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
            const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

            let nextIndex: number | undefined;

            if (event.key === nextKey) {
                nextIndex = activeIndex + 1;
                if (nextIndex >= count) {
                    nextIndex = loop ? 0 : count - 1;
                }
            } else if (event.key === prevKey) {
                nextIndex = activeIndex - 1;
                if (nextIndex < 0) {
                    nextIndex = loop ? count - 1 : 0;
                }
            } else if (event.key === 'Home') {
                nextIndex = 0;
            } else if (event.key === 'End') {
                nextIndex = count - 1;
            }

            if (nextIndex !== undefined) {
                event.preventDefault();
                focusByIndex(nextIndex);
            }
        },
        [activeIndex, focusByIndex, loop, orientation],
    );

    const contextValue = React.useMemo<CompositeContextValue>(
        () => ({
            activeIndex,
            setActiveIndex,
            orientation,
            loop,
            register,
            unregister,
            getIndex,
        }),
        [activeIndex, setActiveIndex, orientation, loop, register, unregister, getIndex],
    );

    const element = useRenderElement('div', {
        render,
        ref,
        props: [
            {role: orientation === 'vertical' ? 'menu' : 'menubar', onKeyDown: handleKeyDown},
            elementProps,
            onKeyDown ? {onKeyDown} : undefined,
            {children},
        ],
    });

    return <CompositeContext.Provider value={contextValue}>{element}</CompositeContext.Provider>;
}
