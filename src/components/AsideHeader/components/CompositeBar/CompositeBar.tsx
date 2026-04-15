import React, {FC, ReactNode, useCallback, useRef} from 'react';

import {List} from '@gravity-ui/uikit';
import AutoSizer, {Size} from 'react-virtualized-auto-sizer';

import {createBlock} from '../../../utils/cn';
import {AsideHeaderItem} from '../../types';

import {Item, ItemProps} from './Item/Item';
import {COLLAPSE_ITEM_ID} from './constants';
import {
    getAutosizeListItems,
    getItemHeight,
    getItemsHeight,
    getItemsMinHeight,
    getMoreButtonItem,
    getSelectedItemIndex,
} from './utils';

import styles from './CompositeBar.module.scss';

const b = createBlock('composite-bar', styles);

type CompositeBarProps = {
    type: 'menu' | 'subheader';
    items: AsideHeaderItem[];
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
};

type CompositeBarViewProps = CompositeBarProps & {
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
            renderItem={(item) => (
                <Item
                    {...item}
                    compact={compact}
                    onMouseLeave={onMouseLeave}
                    onItemClick={onItemClickByIndex(item.onItemClick)}
                    collapseItems={collapseItems}
                />
            )}
        />
    );
};

export const CompositeBar: FC<CompositeBarProps> = ({
    type,
    items,
    menuMoreTitle,
    onItemClick,
    onMoreClick,
    compact,
    compositeId,
    menuItemClassName,
}) => {
    if (items.length === 0) {
        return null;
    }
    let node: ReactNode;

    if (type === 'menu') {
        const minHeight = getItemsMinHeight(items);
        const collapseItem = getMoreButtonItem(menuMoreTitle);
        node = (
            <div className={b({autosizer: true})} style={{minHeight}}>
                {items.length !== 0 && (
                    <AutoSizer>
                        {(size: Size) => {
                            const width = Number.isNaN(size.width) ? 0 : size.width;
                            const height = Number.isNaN(size.height) ? 0 : size.height;

                            const {listItems, collapseItems} = getAutosizeListItems(
                                items,
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
    } else {
        node = (
            <div className={b({subheader: true})}>
                <CompositeBarView
                    type="subheader"
                    menuItemClassName={menuItemClassName}
                    compact={compact}
                    items={items}
                    onItemClick={onItemClick}
                />
            </div>
        );
    }
    return node;
};
