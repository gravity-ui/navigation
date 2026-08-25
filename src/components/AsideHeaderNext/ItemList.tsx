import * as React from 'react';

import {createBlock} from '../utils/cn';

import {Divider, DividerProps} from './Divider';
import {GroupItem, GroupItemProps} from './GroupItem';
import {Item, ItemProps} from './Item';
import {ItemListProvider, ItemPlace, KeyboardMode} from './LayoutContext';
import {Composite} from './internal/composite/Composite';
import {RenderProp, useRenderElement} from './internal/useRenderElement';

import styles from './ItemList.module.scss';

const b = createBlock('aside-header-next-list', styles);

export type ItemListEntry =
    | ({kind?: 'item'} & ItemProps)
    | ({kind: 'group'} & GroupItemProps)
    | ({kind: 'divider'; id: string} & DividerProps);

export interface ItemListState extends Record<string, unknown> {
    place: ItemPlace;
}

export interface ItemListProps {
    children?: React.ReactNode;
    /** Data-driven alternative to composing rows. */
    items?: ItemListEntry[];
    /** Only feeds `data-place` (i.e. CSS) and the icon-size default. */
    place?: ItemPlace;
    iconSize?: number;
    /**
     * `tab` (default): every row is its own tab stop — the rail is a list of
     * links. `roving`: one tab stop for the list, arrows move — used inside
     * overlays, or opt in for long hierarchical menus.
     */
    keyboard?: KeyboardMode;
    loop?: boolean;
    overflow?: 'visible' | 'scroll';
    role?: string;
    className?: string;
    /** `nav` turns the list into a navigation landmark. */
    tag?: 'div' | 'nav';
    'aria-label'?: string;
    render?: RenderProp<ItemListState>;
    ref?: React.Ref<HTMLElement>;
}

function renderEntry(entry: ItemListEntry) {
    if (entry.kind === 'divider') {
        return <Divider key={entry.id} className={entry.className} />;
    }
    if (entry.kind === 'group') {
        const {kind: _kind, ...rest} = entry;
        return <GroupItem key={rest.id} {...rest} />;
    }
    const {kind: _kind, ...rest} = entry as {kind?: 'item'} & ItemProps;
    return <Item key={rest.id} {...rest} />;
}

interface InnerProps extends Omit<ItemListProps, 'items' | 'place' | 'iconSize' | 'keyboard'> {
    place: ItemPlace;
    listClassName: string;
}

function PlainList(props: InnerProps) {
    const {children, role, listClassName, tag = 'div', render, ref, place, ...rest} = props;

    return useRenderElement<ItemListState>(tag, {
        render,
        ref,
        state: {place},
        props: [{className: listClassName, role, children}, rest],
    });
}

function RovingList(props: InnerProps) {
    const {
        children,
        role,
        listClassName,
        loop,
        render,
        ref,
        place: _place,
        tag: _tag,
        ...rest
    } = props;

    return (
        <Composite
            ref={ref as React.Ref<HTMLDivElement>}
            orientation="vertical"
            loop={loop}
            render={render as RenderProp}
            className={listClassName}
            role={role ?? 'menu'}
            {...rest}
        >
            {children}
        </Composite>
    );
}

/**
 * The single container for navigation rows. Owns the focus model, ARIA roles of
 * its children, overflow and per-row defaults; `Subheader` / `Menu` / `Footer`
 * are presets over it.
 */
export function ItemList(props: ItemListProps) {
    const {
        children,
        items,
        place = 'menu',
        iconSize,
        keyboard = 'tab',
        overflow = 'visible',
        className,
        ...rest
    } = props;

    const contextValue = React.useMemo(
        () => ({place, iconSize, keyboard}),
        [place, iconSize, keyboard],
    );

    const listClassName = b(
        {place, overflow: overflow === 'scroll' ? 'scroll' : undefined},
        className,
    );

    const content = items ? items.map(renderEntry) : children;
    const List = keyboard === 'roving' ? RovingList : PlainList;

    return (
        <ItemListProvider value={contextValue}>
            <List {...rest} place={place} listClassName={listClassName}>
                {content}
            </List>
        </ItemListProvider>
    );
}
