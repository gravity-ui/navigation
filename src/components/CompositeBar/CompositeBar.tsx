import React, {FC, ReactNode, useCallback, useContext, useRef} from 'react';
import AutoSizer, {Size} from 'react-virtualized-auto-sizer';
import {List} from '@gravity-ui/uikit';

import {block} from '../utils/cn';
import {MenuItem, SubheaderMenuItem} from '../types';
import {
    getItemsHeight,
    getItemHeight,
    getSelectedItemIndex,
    getItemsMinHeight,
    getMoreButtonItem,
    getAutosizeListItems,
    isMenuItem,
} from './utils';
import {Item, ItemProps} from './Item/Item';

import {MultipleTooltip, MultipleTooltipContext, MultipleTooltipProvider} from './MultipleTooltip';
import {COLLAPSE_ITEM_ID} from './constants';
import {ASIDE_HEADER_COMPACT_WIDTH} from '../constants';
import {useAsideHeaderContext} from '../AsideHeader/AsideHeaderContext';

import './CompositeBar.scss';

const b = block('composite-bar');

export type CompositeBarItem = MenuItem | SubheaderMenuItem;

type CompositeBarItems =
    | {type: 'menu'; items: MenuItem[]}
    | {type: 'subheader'; items: SubheaderMenuItem[]};

export type CompositeBarProps = CompositeBarItems & {
    onItemClick?: (
        item: MenuItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => void;
    multipleTooltip?: boolean;
    menuMoreTitle?: string;
};

type CompositeBarViewProps = CompositeBarProps & {
    collapseItems?: MenuItem[];
};

const CompositeBarView: FC<CompositeBarViewProps> = ({
    type,
    items,
    onItemClick,
    collapseItems,
    multipleTooltip = false,
}) => {
    const ref = useRef<List<CompositeBarItem>>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const {
        setValue: setMultipleTooltipContextValue,
        active: multipleTooltipActive,
        activeIndex,
        lastClickedItemIndex,
    } = useContext(MultipleTooltipContext);
    const {compact} = useAsideHeaderContext();

    const onTooltipMouseEnter = useCallback(
        (e) => {
            if (
                !multipleTooltipActive &&
                activeIndex !== lastClickedItemIndex &&
                e.clientX <= ASIDE_HEADER_COMPACT_WIDTH
            ) {
                setMultipleTooltipContextValue?.({
                    active: true,
                });
            }
        },
        [multipleTooltipActive, activeIndex, lastClickedItemIndex, setMultipleTooltipContextValue],
    );

    const onTooltipMouseLeave = useCallback(() => {
        if (multipleTooltipActive) {
            setMultipleTooltipContextValue?.({
                active: false,
                lastClickedItemIndex: undefined,
            });
        }
    }, [multipleTooltipActive, setMultipleTooltipContextValue]);

    const onMouseEnterByIndex = useCallback(
        (itemIndex) => () => {
            if (multipleTooltip) {
                let multipleTooltipActiveValue = multipleTooltipActive;
                if (!multipleTooltipActive && itemIndex !== lastClickedItemIndex) {
                    multipleTooltipActiveValue = true;
                }
                if (
                    activeIndex === itemIndex &&
                    multipleTooltipActive === multipleTooltipActiveValue
                ) {
                    return;
                }
                setMultipleTooltipContextValue({
                    activeIndex: itemIndex,
                    active: multipleTooltipActiveValue,
                });
            }
        },
        [multipleTooltipActive, activeIndex, lastClickedItemIndex, setMultipleTooltipContextValue],
    );

    const onMouseLeave = useCallback(() => {
        if (compact) {
            ref.current?.activateItem(undefined as unknown as number);
            if (
                multipleTooltip &&
                (activeIndex !== undefined || lastClickedItemIndex !== undefined)
            ) {
                setMultipleTooltipContextValue({
                    activeIndex: undefined,
                    lastClickedItemIndex: undefined,
                });
            }
        }
    }, [activeIndex, lastClickedItemIndex, setMultipleTooltipContextValue]);

    const onItemClickByIndex = useCallback(
        (itemIndex): ItemProps['onItemClick'] =>
            (item, collapsed, event) => {
                if (
                    compact &&
                    multipleTooltip &&
                    itemIndex !== lastClickedItemIndex &&
                    item.id !== COLLAPSE_ITEM_ID
                ) {
                    setMultipleTooltipContextValue({
                        lastClickedItemIndex: itemIndex,
                        active: false,
                    });
                }
                onItemClick?.(item, collapsed, event);
            },
        [lastClickedItemIndex, setMultipleTooltipContextValue],
    );

    return (
        <React.Fragment>
            <div
                ref={tooltipRef}
                onMouseEnter={onTooltipMouseEnter}
                onMouseLeave={onTooltipMouseLeave}
            >
                <List<CompositeBarItem>
                    ref={ref}
                    items={items}
                    selectedItemIndex={type === 'menu' ? getSelectedItemIndex(items) : undefined}
                    itemHeight={getItemHeight}
                    itemsHeight={getItemsHeight}
                    itemClassName={b('root-menu-item')}
                    virtualized={false}
                    filterable={false}
                    sortable={false}
                    renderItem={(item, _isItemActive, itemIndex) => {
                        const itemExtraProps = isMenuItem(item) ? {item} : item;
                        const enableTooltip = isMenuItem(item)
                            ? !multipleTooltip
                            : item.enableTooltip;

                        return (
                            <Item
                                {...itemExtraProps}
                                enableTooltip={enableTooltip}
                                onMouseEnter={onMouseEnterByIndex(itemIndex)}
                                onMouseLeave={onMouseLeave}
                                onItemClick={onItemClickByIndex(itemIndex)}
                                collapseItems={collapseItems}
                            />
                        );
                    }}
                />
            </div>
            {type === 'menu' && (
                <MultipleTooltip
                    open={compact && multipleTooltip && multipleTooltipActive}
                    anchorRef={tooltipRef}
                    placement={['right-start']}
                    items={items}
                />
            )}
        </React.Fragment>
    );
};

export const CompositeBar: FC<CompositeBarProps> = ({
    type,
    items,
    menuMoreTitle,
    onItemClick,
    multipleTooltip = false,
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
                        {({width, height}: Size) => {
                            const {listItems, collapseItems} = getAutosizeListItems(
                                items,
                                height,
                                collapseItem,
                            );
                            return (
                                <div style={{width, height}}>
                                    <CompositeBarView
                                        type="menu"
                                        items={listItems}
                                        onItemClick={onItemClick}
                                        collapseItems={collapseItems}
                                        multipleTooltip={multipleTooltip}
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
            <div className={b()}>
                <CompositeBarView type="subheader" items={items} onItemClick={onItemClick} />
            </div>
        );
    }
    return <MultipleTooltipProvider>{node}</MultipleTooltipProvider>;
};
