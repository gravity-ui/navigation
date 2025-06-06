import React, {FC, ReactNode, useCallback, useContext, useRef} from 'react';

import {List} from '@gravity-ui/uikit';
import AutoSizer, {Size} from 'react-virtualized-auto-sizer';

import {ASIDE_HEADER_COMPACT_WIDTH} from '../../../constants';
import {createBlock} from '../utils/cn';
import {AsideHeaderItem} from '../../types';

import {Item, ItemProps} from './Item/Item';
import {MultipleTooltip, MultipleTooltipContext, MultipleTooltipProvider} from './MultipleTooltip';
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

export type CompositeBarProps = {
    type: 'menu' | 'subheader';
    items: AsideHeaderItem[];
    onItemClick?: (
        item: AsideHeaderItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    multipleTooltip?: boolean;
    menuMoreTitle?: string;
    onMoreClick?: () => void;
    compact: boolean;
    compositeId?: string;
};

type CompositeBarViewProps = CompositeBarProps & {
    collapseItems?: AsideHeaderItem[];
    compositeId?: string;
};

const CompositeBarView: FC<CompositeBarViewProps> = ({
    type,
    items,
    onItemClick,
    onMoreClick,
    collapseItems,
    multipleTooltip = false,
    compact,
    compositeId,
}) => {
    const ref = useRef<List<AsideHeaderItem>>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const {
        setValue: setMultipleTooltipContextValue,
        active: multipleTooltipActive,
        activeIndex,
        lastClickedItemIndex,
    } = useContext(MultipleTooltipContext);

    React.useEffect(() => {
        function handleBlurWindow() {
            if (multipleTooltip && multipleTooltipActive) {
                setMultipleTooltipContextValue({active: false});
            }
        }

        window.addEventListener('blur', handleBlurWindow);

        return () => {
            window.removeEventListener('blur', handleBlurWindow);
        };
    }, [multipleTooltip, multipleTooltipActive, setMultipleTooltipContextValue]);

    const onTooltipMouseEnter = useCallback(
        (e: {clientX: number}) => {
            if (
                multipleTooltip &&
                compact &&
                !multipleTooltipActive &&
                document.hasFocus() &&
                activeIndex !== lastClickedItemIndex &&
                e.clientX <= ASIDE_HEADER_COMPACT_WIDTH
            ) {
                setMultipleTooltipContextValue?.({
                    active: true,
                });
            }
        },
        [
            multipleTooltip,
            compact,
            multipleTooltipActive,
            activeIndex,
            lastClickedItemIndex,
            setMultipleTooltipContextValue,
        ],
    );

    const onTooltipMouseLeave = useCallback(() => {
        if (multipleTooltip && multipleTooltipActive && document.hasFocus()) {
            setMultipleTooltipContextValue?.({
                active: false,
                lastClickedItemIndex: undefined,
            });
        }
    }, [multipleTooltip, multipleTooltipActive, setMultipleTooltipContextValue]);

    const onMouseEnterByIndex = useCallback(
        (itemIndex: number) => () => {
            if (multipleTooltip && document.hasFocus()) {
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
        [
            multipleTooltip,
            multipleTooltipActive,
            lastClickedItemIndex,
            activeIndex,
            setMultipleTooltipContextValue,
        ],
    );

    const onMouseLeave = useCallback(() => {
        if (compact && document.hasFocus()) {
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
    }, [
        activeIndex,
        compact,
        lastClickedItemIndex,
        multipleTooltip,
        setMultipleTooltipContextValue,
    ]);

    const onItemClickByIndex = useCallback(
        (
            itemIndex: number,
            orginalItemClick: AsideHeaderItem['onItemClick'],
        ): ItemProps['onItemClick'] =>
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

                // Handle clicks on the "more" button (collapse item)
                if (item.id === COLLAPSE_ITEM_ID && collapsed) {
                    onMoreClick?.();
                } else {
                    onItemClick?.({...item, onItemClick: orginalItemClick}, collapsed, event);
                }
            },
        [
            compact,
            lastClickedItemIndex,
            multipleTooltip,
            onItemClick,
            onMoreClick,
            setMultipleTooltipContextValue,
        ],
    );

    return (
        <React.Fragment>
            <div
                ref={tooltipRef}
                onMouseEnter={onTooltipMouseEnter}
                onMouseLeave={onTooltipMouseLeave}
            >
                <List<AsideHeaderItem>
                    id={compositeId}
                    ref={ref}
                    items={items}
                    selectedItemIndex={type === 'menu' ? getSelectedItemIndex(items) : undefined}
                    itemHeight={getItemHeight}
                    itemsHeight={getItemsHeight}
                    itemClassName={b('root-menu-item')}
                    virtualized={false}
                    filterable={false}
                    sortable={false}
                    renderItem={(item, _isItemActive, itemIndex) => (
                        <Item
                            {...item}
                            compact={compact}
                            onMouseEnter={onMouseEnterByIndex(itemIndex)}
                            onMouseLeave={onMouseLeave}
                            onItemClick={onItemClickByIndex(itemIndex, item.onItemClick)}
                            collapseItems={collapseItems}
                        />
                    )}
                />
            </div>
            {type === 'menu' && multipleTooltip && (
                <MultipleTooltip
                    open={compact && multipleTooltipActive}
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
    onMoreClick,
    multipleTooltip = false,
    compact,
    compositeId,
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
            <div className={b({subheader: true})}>
                <CompositeBarView
                    type="subheader"
                    compact={compact}
                    items={items}
                    onItemClick={onItemClick}
                />
            </div>
        );
    }
    return <MultipleTooltipProvider>{node}</MultipleTooltipProvider>;
};
