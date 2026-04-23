import React, {FC, ReactNode, useCallback, useMemo, useRef} from 'react';

import {List} from '@gravity-ui/uikit';
import AutoSizer, {Size} from 'react-virtualized-auto-sizer';

import {MenuGroup} from '../../../types';
import {createBlock} from '../../../utils/cn';
import {AsideHeaderItem, AsideHeaderMenuOverflow} from '../../types';

import {Item} from './Item/Item';
import {ItemProps} from './Item/Item.types';
import {ScrollableWithScrollbar} from './ScrollableWithScrollbar';
import {COLLAPSE_ITEM_ID} from './constants';
import {getGroupedItems, isGroupHeaderItem} from './grouping';
import {
    getAutosizeListItems,
    getItemHeight,
    getItemsHeight,
    getItemsMinHeight,
    getMoreButtonItem,
    getReorderedItems,
    getSelectedItemIndex,
} from './utils';

import styles from './CompositeBar.module.scss';

const b = createBlock('composite-bar', styles);

type CompositeBarProps = {
    type: 'menu' | 'subheader';
    items: AsideHeaderItem[];
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
};

type CompositeBarViewProps = Omit<CompositeBarProps, 'menuOverflow'> & {
    collapseItems?: AsideHeaderItem[];
};

const CompositeBarView: FC<CompositeBarViewProps> = ({
    type,
    items,
    onItemClick,
    onMoreClick,
    collapseItems,
    compact,
    compositeId,
    menuItemClassName,
}) => {
    const ref = useRef<List<AsideHeaderItem>>(null);

    const onMouseLeave = useCallback(() => {
        if (compact && document.hasFocus()) {
            ref.current?.activateItem(undefined as unknown as number);
        }
    }, [compact]);

    const onItemClickByIndex = useCallback(
        (orginalItemClick: AsideHeaderItem['onItemClick']): ItemProps['onItemClick'] =>
            (item, collapsed, event) => {
                // Handle clicks on the "more" button (collapse item)
                if (item.id === COLLAPSE_ITEM_ID && collapsed) {
                    onMoreClick?.();
                } else {
                    onItemClick?.(
                        {
                            ...item,
                            // For collapsed popup items, preserve the item's own onItemClick
                            // since orginalItemClick belongs to the collapse button, not the item
                            onItemClick: collapsed ? item.onItemClick : orginalItemClick,
                        },
                        collapsed,
                        event,
                    );
                }
            },
        [onItemClick, onMoreClick],
    );

    return (
        <List<AsideHeaderItem>
            id={compositeId}
            ref={ref}
            items={items}
            selectedItemIndex={type === 'menu' ? getSelectedItemIndex(items) : undefined}
            itemHeight={getItemHeight}
            itemsHeight={getItemsHeight}
            itemClassName={b('root-menu-item', menuItemClassName)}
            virtualized={false}
            filterable={false}
            sortable={false}
            renderItem={(item) => {
                let menuPopupItems: AsideHeaderItem[] | undefined;
                let menuPopupTitle: string | undefined;

                if (item.id === COLLAPSE_ITEM_ID) {
                    menuPopupItems = collapseItems;
                } else if (isGroupHeaderItem(item)) {
                    menuPopupItems = item.groupChildren;
                    menuPopupTitle = item.groupPopupTitle;
                }

                return (
                    <Item
                        {...item}
                        compact={compact}
                        popupItemClassName={menuItemClassName}
                        menuPopupItems={menuPopupItems}
                        menuPopupTitle={menuPopupTitle}
                        onMouseLeave={onMouseLeave}
                        onItemClick={onItemClickByIndex(item.onItemClick)}
                    />
                );
            }}
        />
    );
};

export const CompositeBar: FC<CompositeBarProps> = ({
    type,
    items,
    menuGroups,
    menuMoreTitle,
    onItemClick,
    onMoreClick,
    compact,
    compositeId,
    menuItemClassName,
    menuOverflow = 'collapse',
}) => {
    const groupedItems = useMemo(() => getGroupedItems(items, menuGroups), [items, menuGroups]);

    // Respect `afterMoreButton` ordering for DOM stability when items are rendered
    // inside a scroll container (no collapse button to anchor them against).
    const scrollableItems = useMemo(() => getReorderedItems(groupedItems), [groupedItems]);

    if (groupedItems.length === 0) {
        return null;
    }
    let node: ReactNode;

    if (type === 'menu') {
        // `scroll` mode is intentionally disabled in `compact` mode — there the
        // classic "More" popup gives a better UX for icon-only items.
        if (menuOverflow === 'scroll' && !compact) {
            node = (
                <ScrollableWithScrollbar recalcDeps={[scrollableItems]}>
                    <CompositeBarView
                        compositeId={compositeId}
                        type="menu"
                        compact={compact}
                        items={scrollableItems}
                        onItemClick={onItemClick}
                        menuItemClassName={menuItemClassName}
                    />
                </ScrollableWithScrollbar>
            );
        } else {
            const minHeight = getItemsMinHeight(groupedItems);
            const collapseItem = getMoreButtonItem(menuMoreTitle);
            node = (
                <div className={b({autosizer: true})} style={{minHeight}}>
                    {groupedItems.length !== 0 && (
                        <AutoSizer>
                            {(size: Size) => {
                                const width = Number.isNaN(size.width) ? 0 : size.width;
                                const height = Number.isNaN(size.height) ? 0 : size.height;

                                const {listItems, collapseItems} = getAutosizeListItems(
                                    groupedItems,
                                    height,
                                    collapseItem,
                                );
                                return (
                                    <div style={{width, height}}>
                                        <CompositeBarView
                                            compositeId={compositeId}
                                            type="menu"
                                            compact={compact}
                                            items={listItems}
                                            onItemClick={onItemClick}
                                            onMoreClick={onMoreClick}
                                            menuItemClassName={menuItemClassName}
                                            collapseItems={collapseItems}
                                        />
                                    </div>
                                );
                            }}
                        </AutoSizer>
                    )}
                </div>
            );
        }
    } else {
        node = (
            <div className={b({subheader: true})}>
                <CompositeBarView
                    type="subheader"
                    menuItemClassName={menuItemClassName}
                    compact={compact}
                    items={groupedItems}
                    onItemClick={onItemClick}
                />
            </div>
        );
    }
    return node;
};
