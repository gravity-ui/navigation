import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import block from 'bem-cn-lite';

import {MenuItem} from './../types';
import {getItemsHeight, getItemHeight, getSelectedItemIndex} from './utils';
import {COLLAPSE_ITEM_ID, ITEM_HEIGHT} from './constants';

import {List} from '@gravity-ui/uikit';

import {Item} from './Item/Item';
import dotsIcon from '../../../assets/icons/dots.svg';

import './CompositeBar.scss';

const b = block('composite-bar');

export interface CompositeBarProps {
    items: MenuItem[];
    compact: boolean;
    onClickItem?: (item: MenuItem) => void;
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
        const pinnedItems = this.props.items.filter((item) => item.pinned);
        const minHeight =
            getItemsHeight(pinnedItems) +
            (pinnedItems.length === this.props.items.length ? 0 : ITEM_HEIGHT);
        return (
            <React.Fragment>
                <div className={b()} style={{minHeight}}>
                    {this.props.items.length !== 0 && (
                        <AutoSizer>
                            {({width, height}) => {
                                const style = {
                                    width,
                                    height,
                                };
                                return <div style={style}>{this.renderMenu(height)}</div>;
                            }}
                        </AutoSizer>
                    )}
                </div>
            </React.Fragment>
        );
    }

    private renderMenu(height: number) {
        const {items, compact, onClickItem} = this.props;
        const extraItemHeight = items.reduce(
            (sum, item) => sum + (getItemHeight(item) - ITEM_HEIGHT),
            0,
        );
        const capacity = Math.max(1, Math.floor((height - extraItemHeight) / ITEM_HEIGHT));
        let listItems: MenuItem[] | null;
        let collapseItems: MenuItem[] | null = null;

        const afterMoreButtonItems: MenuItem[] = items.filter((item) => item.afterMoreButton);

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

        if (collapseItems && collapseItems.length === 1) {
            listItems = listItems.concat(collapseItems);
        } else if (collapseItems && collapseItems.length > 1) {
            listItems.push(this.getMoreButtonItem());
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
                        onClick={() => onClickItem?.(item)}
                    />
                )}
            />
        );
    }

    private getMoreButtonItem(): MenuItem {
        return {
            id: COLLAPSE_ITEM_ID,
            title: 'More', // TODO localize,
            icon: dotsIcon,
            iconSize: 16,
        };
    }
}
