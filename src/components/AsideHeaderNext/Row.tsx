import * as React from 'react';

import {createBlock} from '../utils/cn';

import {ItemPlace, useItemListContext, useLayoutContext} from './LayoutContext';
import {RenderProp, useRenderElement} from './internal/useRenderElement';

import styles from './Row.module.scss';

/** Shared with `Item`, `GroupItem.Trigger`, `Logo`, `CollapseButton`. */
export const rowBlock = createBlock('aside-header-next-row', styles);

export interface RowState extends Record<string, unknown> {
    compact: boolean;
    place: ItemPlace;
}

export interface RowProps {
    children?: React.ReactNode;
    /** Adds hover/active affordances and a pointer cursor. */
    interactive?: boolean;
    /** Only feeds `data-place` (i.e. CSS). Defaults to the enclosing list. */
    place?: ItemPlace;
    className?: string;
    render?: RenderProp<RowState>;
    ref?: React.Ref<HTMLElement>;
    [key: string]: unknown;
}

/**
 * The layout contract every rail row shares:
 *
 *     [ Leading 56px ][ Body 1fr ][ Trailing auto ]
 *       always visible  hidden in compact
 *
 * Exported publicly so custom content behaves in `compact` exactly like the
 * built-in parts do.
 */
export function Row(props: RowProps) {
    const {children, interactive, place, className, render, ref, ...rest} = props;
    const {compact} = useLayoutContext();
    const list = useItemListContext();
    const resolvedPlace = place ?? list.place;
    // A popup always has room, so its rows stay expanded even in a compact rail.
    const compactRow = compact && resolvedPlace !== 'popup';

    return useRenderElement<RowState>('div', {
        render,
        ref,
        state: {compact: compactRow, place: resolvedPlace},
        props: [
            {
                className: rowBlock({interactive}, className),
                'data-place': resolvedPlace,
                'data-compact': compactRow || undefined,
                children,
            },
            rest,
        ],
    });
}

interface ZoneProps {
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLElement>;
}

function makeZone(name: 'leading' | 'body' | 'trailing') {
    return function Zone(zoneProps: ZoneProps) {
        const {children, className, ref} = zoneProps;
        return (
            <span ref={ref as React.Ref<HTMLSpanElement>} className={rowBlock(name, className)}>
                {children}
            </span>
        );
    };
}

/** Icon / avatar lane — the zone that survives `compact`. */
export const RowLeading = makeZone('leading');
/** Title and free-form content — clipped, then hidden in `compact`. */
export const RowBody = makeZone('body');
/** Adornments, chevrons, counters — hidden in `compact`. */
export const RowTrailing = makeZone('trailing');

Row.Leading = RowLeading;
Row.Body = RowBody;
Row.Trailing = RowTrailing;
