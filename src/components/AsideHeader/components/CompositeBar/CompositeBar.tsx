import React, {FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {List} from '@gravity-ui/uikit';
import AutoSizer, {Size} from 'react-virtualized-auto-sizer';

import {MenuGroup} from '../../../types';
import {createBlock} from '../../../utils/cn';
import {useAsideHeaderContext} from '../../AsideHeaderContext';
import {AsideHeaderItem, AsideHeaderMenuOverflow} from '../../types';

import {Item} from './Item/Item';
import {ItemProps} from './Item/Item.types';
import {ScrollableWithScrollbar} from './ScrollableWithScrollbar';
import {COLLAPSE_ITEM_ID} from './constants';
import {buildCompositeBarRows} from './grouping';
import type {CompositeBarRow} from './grouping';
import {
    getAutosizeCompositeBarRows,
    getCompositeBarRowsMinHeight,
    getItemHeight,
    getItemsHeight,
    getMoreButtonItem,
    getReorderedCompositeBarRows,
    getSelectedCompositeBarRowIndex,
    getSelectedItemIndex,
    makeGroupHeaderAsideItem,
} from './utils';

import styles from './CompositeBar.module.scss';

const b = createBlock('composite-bar', styles);

/** Row L-connector: vertical segment + rounded hook. viewBox matches `variables.$item-height`; path x=8 is connector center (matches 1px spine). */
const MENU_GROUP_NESTED_TREE_CONNECTOR_PATH = 'M8 0V10.07935C8 15.558375 11.5846 20 15.9678 20';

type CompositeBarProps = {
    type: 'menu' | 'subheader' | 'quick-access';
    items: AsideHeaderItem[];
    className?: string;
    menuGroups?: MenuGroup[];
    onItemClick?: (
        item: AsideHeaderItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    menuMoreTitle?: string;
    onMoreClick?: () => void;
    compact: boolean;
    compositeId?: string;
    menuItemClassName?: string;
    /**
     * @see AsideHeaderMenuOverflow
     */
    menuOverflow?: AsideHeaderMenuOverflow;
    collapsedMenuGroupIds?: Record<string, boolean>;
    defaultCollapsedMenuGroupIds?: Record<string, boolean>;
    onToggleMenuGroupCollapsed?: (groupId: string) => void;
    onMenuScrollOverflowChange?: (overflows: boolean) => void;
    /** Skips the internal scroll wrapper when the parent already provides one. */
    disableScrollWrapper?: boolean;
    /** Notifies the parent when scrollable menu content height may have changed. */
    onScrollContentChange?: () => void;
    enableQuickAccessPin?: boolean;
    onToggleQuickAccess?: (item: AsideHeaderItem) => void;
    menuGroupNestedIcons?: boolean;
};

type CompositeBarViewProps = {
    type: 'menu' | 'subheader' | 'quick-access';
    compositeId?: string;
    compact: boolean;
    menuItemClassName?: string;
    rows: CompositeBarRow[];
    onItemClick?: CompositeBarProps['onItemClick'];
    onMoreClick?: () => void;
    collapseItems?: AsideHeaderItem[];
    /** Nested group list + tree connectors (expanded menu + scroll overflow only). */
    inlineGroupChildren: boolean;
    isGroupCollapsed: (groupId: string) => boolean;
    onToggleGroupCollapsed: (groupId: string) => void;
    enableQuickAccessPin?: boolean;
    onToggleQuickAccess?: (item: AsideHeaderItem) => void;
    menuGroupNestedIcons?: boolean;
};

const CompositeBarView: FC<CompositeBarViewProps> = ({
    type,
    rows,
    onItemClick,
    onMoreClick,
    collapseItems,
    compact,
    compositeId,
    menuItemClassName,
    inlineGroupChildren,
    isGroupCollapsed,
    onToggleGroupCollapsed,
    enableQuickAccessPin,
    onToggleQuickAccess,
    menuGroupNestedIcons = true,
}) => {
    const ref = useRef<List<CompositeBarRow>>(null);
    const hideNestedIcons = !menuGroupNestedIcons;
    const menuPopupHideIcon = hideNestedIcons;
    const {menuDensity} = useAsideHeaderContext();
    const itemLayout = useMemo(
        () => (compact ? {sidebarCompact: true as const} : undefined),
        [compact],
    );

    const onMouseLeave = useCallback(() => {
        if (compact && document.hasFocus()) {
            ref.current?.activateItem(undefined);
        }
    }, [compact]);

    const deactivateParentListItem = useCallback(() => {
        ref.current?.activateItem(undefined);
    }, []);

    const onPopupItemClick = useCallback(
        (
            item: AsideHeaderItem,
            collapsed: boolean,
            event: React.MouseEvent<HTMLElement, MouseEvent>,
        ) => {
            onItemClick?.(item, collapsed, event);
        },
        [onItemClick],
    );

    const onItemClickByIndex = useCallback(
        (orginalItemClick: AsideHeaderItem['onItemClick']): ItemProps['onItemClick'] =>
            (item, collapsed, event) => {
                if (item.id === COLLAPSE_ITEM_ID && collapsed) {
                    onMoreClick?.();
                } else {
                    onItemClick?.(
                        {
                            ...item,
                            onItemClick: orginalItemClick,
                        },
                        collapsed,
                        event,
                    );
                }
            },
        [onItemClick, onMoreClick],
    );

    const onSyntheticHeaderItemClick = useMemo(
        () => onItemClickByIndex(undefined) as NonNullable<ItemProps['onItemClick']>,
        [onItemClickByIndex],
    );

    const itemHeight = useCallback(
        (row: CompositeBarRow) => {
            if (row.kind === 'item') {
                return getItemHeight(row.item, menuDensity, itemLayout);
            }
            const headerH = getItemHeight(
                makeGroupHeaderAsideItem(row.group),
                menuDensity,
                itemLayout,
            );
            if (!inlineGroupChildren || isGroupCollapsed(row.group.id)) {
                return headerH;
            }
            return headerH + getItemsHeight(row.items, menuDensity, itemLayout);
        },
        [inlineGroupChildren, isGroupCollapsed, menuDensity, itemLayout],
    );

    const nestedItemHeight = useCallback(
        (item: AsideHeaderItem) => getItemHeight(item, menuDensity, itemLayout),
        [menuDensity, itemLayout],
    );

    const nestedItemsHeight = useCallback(
        (listItems: AsideHeaderItem[]) => getItemsHeight(listItems, menuDensity, itemLayout),
        [menuDensity, itemLayout],
    );

    const itemsHeight = useCallback(
        (listRows: CompositeBarRow[]) => listRows.reduce((sum, row) => sum + itemHeight(row), 0),
        [itemHeight],
    );

    const onToggleQuickAccessByItem = useCallback(
        (item: AsideHeaderItem) => {
            onToggleQuickAccess?.(item);
        },
        [onToggleQuickAccess],
    );

    return (
        <List<CompositeBarRow>
            id={compositeId}
            ref={ref}
            items={rows}
            selectedItemIndex={type === 'menu' ? getSelectedCompositeBarRowIndex(rows) : undefined}
            itemHeight={itemHeight}
            itemsHeight={itemsHeight}
            itemClassName={b('root-menu-item', menuItemClassName)}
            virtualized={false}
            filterable={false}
            sortable={false}
            renderItem={(row) => {
                if (row.kind === 'item') {
                    const item = row.item;
                    let menuPopupItems: AsideHeaderItem[] | undefined;
                    let menuPopupTitle: string | undefined;

                    if (item.id === COLLAPSE_ITEM_ID) {
                        menuPopupItems = collapseItems;
                    } else {
                        menuPopupItems = item.compositeBarMenuPopupItems;
                        menuPopupTitle = item.compositeBarMenuPopupTitle;
                    }

                    return (
                        <Item
                            {...item}
                            compact={compact}
                            popupItemClassName={menuItemClassName}
                            menuPopupItems={menuPopupItems}
                            menuPopupTitle={menuPopupTitle}
                            onMouseLeave={onMouseLeave}
                            onPopupItemClick={onPopupItemClick}
                            onItemClick={onItemClickByIndex(item.onItemClick)}
                            enableQuickAccessPin={enableQuickAccessPin}
                            onToggleQuickAccess={onToggleQuickAccessByItem}
                        />
                    );
                }

                const headerItem = makeGroupHeaderAsideItem(row.group);
                const groupIsCollapsed = isGroupCollapsed(row.group.id);

                if (!inlineGroupChildren) {
                    return (
                        <Item
                            {...headerItem}
                            compact={compact}
                            popupItemClassName={menuItemClassName}
                            menuPopupItems={row.items}
                            menuPopupTitle={row.group.popupTitle}
                            menuPopupHideIcon={menuPopupHideIcon}
                            className={b('menu-group-header')}
                            onMouseLeave={onMouseLeave}
                            onPopupItemClick={onPopupItemClick}
                            onItemClick={onSyntheticHeaderItemClick}
                            enableQuickAccessPin={enableQuickAccessPin}
                            onToggleQuickAccess={onToggleQuickAccessByItem}
                        />
                    );
                }

                const selectedItemIndex = getSelectedItemIndex(row.items);

                return (
                    <div
                        className={b('menu-group', {
                            expanded: !groupIsCollapsed,
                            collapsed: groupIsCollapsed,
                        })}
                        onMouseEnter={deactivateParentListItem}
                    >
                        <Item
                            {...headerItem}
                            compact={compact}
                            popupItemClassName={menuItemClassName}
                            className={b('menu-group-header')}
                            groupHeaderExpanded={!groupIsCollapsed}
                            menuPopupItems={groupIsCollapsed ? row.items : undefined}
                            menuPopupTitle={groupIsCollapsed ? row.group.popupTitle : undefined}
                            menuPopupHideIcon={menuPopupHideIcon}
                            onMouseLeave={onMouseLeave}
                            onPopupItemClick={onPopupItemClick}
                            onItemClick={(item, isItemCollapsed, event) => {
                                onToggleGroupCollapsed(row.group.id);
                                onSyntheticHeaderItemClick(item, isItemCollapsed, event);
                            }}
                            enableQuickAccessPin={enableQuickAccessPin}
                            onToggleQuickAccess={onToggleQuickAccessByItem}
                        />
                        {!groupIsCollapsed && (
                            <List<AsideHeaderItem>
                                items={row.items}
                                selectedItemIndex={selectedItemIndex}
                                itemHeight={nestedItemHeight}
                                itemsHeight={nestedItemsHeight}
                                itemClassName={b('menu-group-nested-list-item')}
                                virtualized={false}
                                filterable={false}
                                sortable={false}
                                renderItem={(nestedItem) => {
                                    return (
                                        <div className={b('menu-group-nested-row-inner')}>
                                            <Item
                                                {...nestedItem}
                                                className={[
                                                    nestedItem.className,
                                                    b('menu-group-nested-item'),
                                                ]
                                                    .filter(Boolean)
                                                    .join(' ')}
                                                compact={compact}
                                                hideIcon={hideNestedIcons}
                                                menuGroupNested
                                                menuGroupNestedTreeConnector={
                                                    <span
                                                        className={b('menu-group-nested-connector')}
                                                        aria-hidden
                                                    >
                                                        <svg
                                                            className={b(
                                                                'menu-group-nested-tree-svg',
                                                            )}
                                                            viewBox="0 0 16 40"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d={
                                                                    MENU_GROUP_NESTED_TREE_CONNECTOR_PATH
                                                                }
                                                                fill="none"
                                                                strokeLinecap="butt"
                                                                strokeWidth="1"
                                                                vectorEffect="non-scaling-stroke"
                                                            />
                                                        </svg>
                                                    </span>
                                                }
                                                onMouseLeave={onMouseLeave}
                                                onItemClick={onItemClickByIndex(
                                                    nestedItem.onItemClick,
                                                )}
                                                enableQuickAccessPin={enableQuickAccessPin}
                                                onToggleQuickAccess={onToggleQuickAccessByItem}
                                            />
                                        </div>
                                    );
                                }}
                            />
                        )}
                    </div>
                );
            }}
        />
    );
};

export const CompositeBar: FC<CompositeBarProps> = ({
    type,
    className,
    items,
    menuGroups,
    menuMoreTitle,
    onItemClick,
    onMoreClick,
    compact,
    compositeId,
    menuItemClassName,
    menuOverflow = 'collapse',
    collapsedMenuGroupIds: collapsedMenuGroupIdsProp,
    defaultCollapsedMenuGroupIds,
    onToggleMenuGroupCollapsed,
    onMenuScrollOverflowChange,
    disableScrollWrapper = false,
    onScrollContentChange,
    enableQuickAccessPin,
    onToggleQuickAccess,
    menuGroupNestedIcons = true,
}) => {
    const rows = useMemo(() => buildCompositeBarRows(items, menuGroups), [items, menuGroups]);
    const {menuDensity} = useAsideHeaderContext();

    const isCollapsedControlled = collapsedMenuGroupIdsProp !== undefined;
    const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState<Record<string, boolean>>(
        () => defaultCollapsedMenuGroupIds ?? {},
    );

    const collapsedMap = isCollapsedControlled ? collapsedMenuGroupIdsProp : uncontrolledCollapsed;

    const onToggleGroupCollapsed = useCallback(
        (groupId: string) => {
            onToggleMenuGroupCollapsed?.(groupId);
            if (!isCollapsedControlled) {
                setUncontrolledCollapsed((prev) => ({...prev, [groupId]: !prev[groupId]}));
            }
        },
        [isCollapsedControlled, onToggleMenuGroupCollapsed],
    );

    const isGroupCollapsed = useCallback(
        (groupId: string) => Boolean(collapsedMap[groupId]),
        [collapsedMap],
    );

    const inlineGroupChildren =
        !compact && menuOverflow === 'scroll' && type === 'menu' && Boolean(menuGroups?.length);

    const scrollableRows = useMemo(() => getReorderedCompositeBarRows(rows), [rows]);

    const scrollRecalcKey = useMemo(
        () =>
            `${items.length}:${menuGroups?.length ?? 0}:${JSON.stringify(
                Object.keys(collapsedMap)
                    .sort()
                    .reduce<Record<string, boolean>>((acc, k) => {
                        acc[k] = Boolean(collapsedMap[k]);
                        return acc;
                    }, {}),
            )}`,
        [items.length, menuGroups?.length, collapsedMap],
    );

    useEffect(() => {
        onScrollContentChange?.();
    }, [scrollRecalcKey, onScrollContentChange]);

    if (rows.length === 0) {
        return null;
    }

    let node: ReactNode;

    if (type === 'menu') {
        if (menuOverflow === 'scroll' && !compact) {
            const menuView = (
                <CompositeBarView
                    compositeId={compositeId}
                    type="menu"
                    compact={compact}
                    rows={scrollableRows}
                    onItemClick={onItemClick}
                    onMoreClick={onMoreClick}
                    menuItemClassName={menuItemClassName}
                    inlineGroupChildren={inlineGroupChildren}
                    isGroupCollapsed={isGroupCollapsed}
                    onToggleGroupCollapsed={onToggleGroupCollapsed}
                    enableQuickAccessPin={enableQuickAccessPin}
                    onToggleQuickAccess={onToggleQuickAccess}
                    menuGroupNestedIcons={menuGroupNestedIcons}
                />
            );

            node = disableScrollWrapper ? (
                menuView
            ) : (
                <ScrollableWithScrollbar
                    className={className}
                    recalcDeps={[scrollRecalcKey]}
                    onOverflowChange={onMenuScrollOverflowChange}
                >
                    {menuView}
                </ScrollableWithScrollbar>
            );
        } else {
            const itemLayout = compact ? {sidebarCompact: true as const} : undefined;
            const minHeight = getCompositeBarRowsMinHeight(rows, menuDensity, itemLayout);
            const collapseItem = getMoreButtonItem(menuMoreTitle, menuDensity);
            node = (
                <div className={b({autosizer: true})} style={{minHeight}}>
                    {rows.length !== 0 && (
                        <AutoSizer>
                            {(size: Size) => {
                                const width = Number.isNaN(size.width) ? 0 : size.width;
                                const height = Number.isNaN(size.height) ? 0 : size.height;

                                const {listRows, collapseItems} = getAutosizeCompositeBarRows(
                                    rows,
                                    height,
                                    collapseItem,
                                    menuDensity,
                                    itemLayout,
                                );
                                return (
                                    <div style={{width, height}}>
                                        <CompositeBarView
                                            compositeId={compositeId}
                                            type="menu"
                                            compact={compact}
                                            rows={listRows}
                                            onItemClick={onItemClick}
                                            onMoreClick={onMoreClick}
                                            menuItemClassName={menuItemClassName}
                                            collapseItems={collapseItems}
                                            inlineGroupChildren={false}
                                            isGroupCollapsed={isGroupCollapsed}
                                            onToggleGroupCollapsed={onToggleGroupCollapsed}
                                            enableQuickAccessPin={enableQuickAccessPin}
                                            onToggleQuickAccess={onToggleQuickAccess}
                                            menuGroupNestedIcons={menuGroupNestedIcons}
                                        />
                                    </div>
                                );
                            }}
                        </AutoSizer>
                    )}
                </div>
            );
        }
    } else if (type === 'quick-access') {
        node = (
            <div className={b({['quick-access']: true})}>
                <CompositeBarView
                    compositeId={compositeId}
                    type="quick-access"
                    menuItemClassName={menuItemClassName}
                    compact={compact}
                    rows={rows}
                    onItemClick={onItemClick}
                    inlineGroupChildren={false}
                    isGroupCollapsed={isGroupCollapsed}
                    onToggleGroupCollapsed={onToggleGroupCollapsed}
                    enableQuickAccessPin={enableQuickAccessPin}
                    onToggleQuickAccess={onToggleQuickAccess}
                />
            </div>
        );
    } else {
        node = (
            <div className={b({subheader: true})}>
                <CompositeBarView
                    type="subheader"
                    menuItemClassName={menuItemClassName}
                    compact={compact}
                    rows={rows}
                    onItemClick={onItemClick}
                    inlineGroupChildren={false}
                    isGroupCollapsed={isGroupCollapsed}
                    onToggleGroupCollapsed={onToggleGroupCollapsed}
                />
            </div>
        );
    }
    return node;
};
