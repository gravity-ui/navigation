import React, {FC, useRef} from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import {List} from '@gravity-ui/uikit';

import {block} from '../utils/cn';
import {AsideHeaderDict, MenuItem} from './../types';
import {
    getItemsHeight,
    getItemHeight,
    getSelectedItemIndex,
    getItemsMinHeight,
    getMoreButtonItem,
    getAutosizeListItems,
} from './utils';
import {Item} from './Item/Item';

import './CompositeBar.scss';

const b = block('composite-bar');

interface CompositeBarBaseProps {
    items: MenuItem[];
    compact: boolean;
    onItemClick?: (item: MenuItem, collapsed: boolean) => void;
}

interface CompositeBarViewProps extends CompositeBarBaseProps {
    collapseItems?: MenuItem[];
}

export interface CompositeBarProps extends CompositeBarBaseProps {
    enableCollapsing: boolean;
    dict?: AsideHeaderDict;
}

const CompositeBarView: FC<CompositeBarViewProps> = ({
    items,
    compact,
    onItemClick,
    collapseItems,
}) => {
    const ref = useRef<List<MenuItem>>(null);
    return (
        <List<MenuItem>
            ref={ref}
            items={items}
            selectedItemIndex={getSelectedItemIndex(items)}
            itemHeight={getItemHeight}
            itemClassName={b('root-menu-item')}
            itemsHeight={getItemsHeight}
            virtualized={false}
            filterable={false}
            sortable={false}
            renderItem={(item) => (
                <Item
                    item={item}
                    onMouseLeave={() => {
                        if (compact) {
                            ref.current?.activateItem(undefined as unknown as number);
                        }
                    }}
                    compact={compact}
                    collapseItems={collapseItems}
                    onItemClick={onItemClick}
                />
            )}
        />
    );
};

export const CompositeBar: FC<CompositeBarProps> = ({
    items,
    compact,
    enableCollapsing,
    dict,
    onItemClick,
}) => {
    if (items.length === 0) {
        return null;
    }

    if (!enableCollapsing) {
        return (
            <div className={b()}>
                <CompositeBarView items={items} compact={compact} onItemClick={onItemClick} />
            </div>
        );
    }

    const minHeight = getItemsMinHeight(items);
    const collapseItem = getMoreButtonItem(dict);

    return (
        <div className={b({autosizer: true})} style={{minHeight}}>
            {items.length !== 0 && (
                <AutoSizer>
                    {({width, height}) => {
                        const {listItems, collapseItems} = getAutosizeListItems(
                            items,
                            height,
                            collapseItem,
                        );
                        return (
                            <div style={{width, height}}>
                                <CompositeBarView
                                    items={listItems}
                                    compact={compact}
                                    onItemClick={onItemClick}
                                    collapseItems={collapseItems}
                                />
                            </div>
                        );
                    }}
                </AutoSizer>
            )}
        </div>
    );
};
