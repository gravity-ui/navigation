import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import {List} from '@gravity-ui/uikit';

import {block} from '../utils/cn';
import {AsideHeaderDict, Dict, MenuItem} from './../types';
import {getItemsHeight, getItemHeight, getSelectedItemIndex, getItemsMinHeight} from './utils';
import {COLLAPSE_ITEM_ID} from './constants';
import {defaultDict} from './../constants';
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

        const minHeight = getItemsMinHeight(items);

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
        const {compact, onItemClick} = this.props;

        const {listItems, collapseItems} = this.getAutosizeListItems(height);

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

    private getMoreButtonItem(): MenuItem {
        const {dict} = this.props;
        const title = dict?.[Dict.MoreButton] ?? defaultDict[Dict.MoreButton];

        return {
            id: COLLAPSE_ITEM_ID,
            title,
            icon: dotsIcon,
            iconSize: 16,
        };
    }

    private getAutosizeListItems(height: number): {
        listItems: MenuItem[];
        collapseItems: MenuItem[];
    } {
        const {items} = this.props;

        const afterMoreButtonItems = items.filter((item) => item.afterMoreButton);
        const regularItems = items.filter((item) => !item.afterMoreButton);
        const listItems = [...regularItems, ...afterMoreButtonItems];

        const allItemsHeight = getItemsHeight(listItems);
        if (allItemsHeight <= height) {
            return {listItems, collapseItems: []};
        }

        const collapseItem = this.getMoreButtonItem();
        const collapseItemHeight = getItemHeight(collapseItem);

        listItems.splice(regularItems.length, 0, collapseItem);
        const collapseItems: MenuItem[] = [];

        let listHeight = allItemsHeight + collapseItemHeight;
        let index = listItems.length;
        while (listHeight > height) {
            if (index === 0) {
                break;
            }
            index--;

            const item = listItems[index];
            if (item.pinned || item.id === COLLAPSE_ITEM_ID || item.afterMoreButton) {
                continue;
            }
            if (item.type === 'divider') {
                if (index + 1 < listItems.length && listItems[index + 1].type === 'divider') {
                    listHeight -= getItemHeight(item);
                    listItems.splice(index, 1);
                }
                continue;
            }
            listHeight -= getItemHeight(item);
            collapseItems.unshift(...listItems.splice(index, 1));
        }
        if (
            listItems[index].type === 'divider' &&
            (index === 0 || listItems[index - 1].type === 'divider')
        ) {
            listItems.splice(index, 1);
        }

        return {listItems, collapseItems};
    }
}
