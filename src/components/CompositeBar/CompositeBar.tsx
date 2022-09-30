import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import block from 'bem-cn-lite';

import {AsideHeaderDict, Dict, MenuItem} from './../types';
import {getItemsHeight, getItemHeight, getSelectedItemIndex} from './utils';
import {COLLAPSE_ITEM_ID, ITEM_HEIGHT} from './constants';
import {defaultDict} from './../constants';

import {List} from '@gravity-ui/uikit';

import {Item} from './Item/Item';
import dotsIcon from '../../../assets/icons/dots.svg';

import './CompositeBar.scss';

const b = block('composite-bar');

export interface CompositeBarProps {
    items: MenuItem[];
    compact: boolean;
    enableCollapsing: boolean;
    dict?: AsideHeaderDict;
    onItemClick?: (item: MenuItem) => void;
}

interface CompositeBarState {
    activeItemIndex?: number;
}

export class CompositeBar extends React.Component<CompositeBarProps> {
    state: CompositeBarState = {
        activeItemIndex: undefined,
    };
    private listRef = React.createRef<List<MenuItem>>();

    render() {
        const {enableCollapsing, items} = this.props;
        if (!enableCollapsing) {
            return <div className={b()}>{this.renderMenu()}</div>;
        }

        const pinnedItems = items.filter((item) => item.pinned);
        const afterMoreButtonItems = items.filter((item) => item.afterMoreButton);
        const minHeight =
            getItemsHeight(pinnedItems) +
            getItemsHeight(afterMoreButtonItems) +
            (pinnedItems.length === items.length ? 0 : ITEM_HEIGHT);

        return (
            <div className={b({autosizer: true})} style={{minHeight}}>
                {items.length !== 0 && (
                    <AutoSizer>
                        {({width, height}) => {
                            const style = {
                                width,
                                height,
                            };
                            return <div style={style}>{this.renderAutosizeMenu(height)}</div>;
                        }}
                    </AutoSizer>
                )}
            </div>
        );
    }

    private renderAutosizeMenu(height: number) {
        const {dict, items, compact, onItemClick} = this.props;

        const afterMoreButtonItems = items.filter((item) => item.afterMoreButton);

        const extraItemHeight = items.reduce(
            (sum, item) => sum + (getItemHeight(item) - ITEM_HEIGHT),
            afterMoreButtonItems.length * ITEM_HEIGHT,
        );
        const capacity = Math.max(1, Math.floor((height - extraItemHeight) / ITEM_HEIGHT));
        let listItems: MenuItem[] | null;
        let collapseItems: MenuItem[] = [];

        const regularItems: MenuItem[] = items.filter((item) => !item.afterMoreButton);

        if (capacity === 1) {
            listItems = regularItems.filter((item) => item.pinned);
            collapseItems = [...regularItems.filter((item) => !item.pinned)];
        } else if (capacity < items.length) {
            const extraCount = regularItems.filter(
                (item, idx) => item.pinned && idx >= capacity - 1,
            ).length;
            const pinnedFlag = regularItems.reduceRight(
                (acc, curr, idx) => {
                    const useExtraCount = !curr.pinned && idx < capacity - 1 && acc.extraCount > 0;
                    acc.flags.unshift(curr.pinned || useExtraCount);
                    return {
                        flags: acc.flags,
                        extraCount: acc.extraCount - Number(useExtraCount),
                    };
                },
                {flags: [] as boolean[], extraCount},
            ).flags;
            listItems = regularItems.filter(
                (item, idx) => item.pinned || (idx < capacity - 1 && !pinnedFlag[idx]),
            );
            collapseItems = regularItems.filter(
                (item, idx) => !item.pinned && (idx >= capacity - 1 || pinnedFlag[idx]),
            );
        } else {
            listItems = [...regularItems];
        }

        if (collapseItems?.length === 1) {
            listItems = listItems.concat(collapseItems);
        } else if (collapseItems?.length > 1) {
            listItems.push(this.getMoreButtonItem(dict));
        }

        if (afterMoreButtonItems.length) {
            listItems = listItems.concat(afterMoreButtonItems);
        }

        return (
            <List<MenuItem>
                ref={this.listRef}
                items={listItems}
                selectedItemIndex={getSelectedItemIndex(listItems)}
                itemHeight={getItemHeight}
                itemClassName={b('root-menu-item')}
                itemsHeight={getItemsHeight}
                virtualized={false}
                filterable={false}
                sortable={false}
                onItemClick={onItemClick}
                renderItem={(item) => (
                    <Item
                        item={item}
                        onMouseLeave={() => {
                            if (compact) {
                                this.listRef.current?.activateItem(undefined as unknown as number);
                            }
                        }}
                        compact={compact}
                        collapseItems={collapseItems}
                    />
                )}
            />
        );
    }

    private renderMenu() {
        const {items, onItemClick, compact} = this.props;

        return (
            <List<MenuItem>
                ref={this.listRef}
                items={items}
                selectedItemIndex={getSelectedItemIndex(items)}
                itemHeight={getItemHeight}
                itemClassName={b('root-menu-item')}
                itemsHeight={getItemsHeight}
                virtualized={false}
                filterable={false}
                sortable={false}
                onItemClick={onItemClick}
                renderItem={(item) => (
                    <Item
                        item={item}
                        onMouseLeave={() => {
                            if (compact) {
                                this.listRef.current?.activateItem(undefined as unknown as number);
                            }
                        }}
                        compact={compact}
                    />
                )}
            />
        );
    }

    private getMoreButtonItem(dict: CompositeBarProps['dict']): MenuItem {
        const title = dict?.[Dict.MoreButton] ?? defaultDict[Dict.MoreButton];

        return {
            id: COLLAPSE_ITEM_ID,
            title,
            icon: dotsIcon,
            iconSize: 16,
        };
    }
}
