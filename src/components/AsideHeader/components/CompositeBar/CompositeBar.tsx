import React, {FC, ReactNode, useCallback, useContext, useRef} from 'react';

import {List} from '@gravity-ui/uikit';
import AutoSizer, {Size} from 'react-virtualized-auto-sizer';

import {ASIDE_HEADER_COMPACT_WIDTH} from '../../../constants';
import {createBlock} from '../../../utils/cn';
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

type CompositeBarProps = {
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
};

type CompositeBarListProps = {
    compact: boolean;
    compositeId?: string;
    collapseItems?: AsideHeaderItem[];
    items: AsideHeaderItem[];
    listRef: React.RefObject<List<AsideHeaderItem>>;
    multipleTooltip: boolean;
    onItemClickByIndex: (
        itemIndex: number,
        orginalItemClick: AsideHeaderItem['onItemClick'],
    ) => ItemProps['onItemClick'];
    onMouseEnterByIndex: (itemIndex: number) => () => void;
    onMouseLeave: () => void;
    type: CompositeBarProps['type'];
};

const CompositeBarList = React.memo(function CompositeBarList({
    compact,
    compositeId,
    collapseItems,
    items,
    listRef,
    multipleTooltip,
    onItemClickByIndex,
    onMouseEnterByIndex,
    onMouseLeave,
    type,
}: CompositeBarListProps) {
    return (
        <List<AsideHeaderItem>
            id={compositeId}
            ref={listRef}
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
                    enableTooltip={multipleTooltip ? false : item.enableTooltip}
                    compact={compact}
                    onMouseEnter={onMouseEnterByIndex(itemIndex)}
                    onMouseLeave={onMouseLeave}
                    onItemClick={onItemClickByIndex(itemIndex, item.onItemClick)}
                    collapseItems={collapseItems}
                />
            )}
        />
    );
});

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
    const multipleTooltipStateRef = useRef({
        active: multipleTooltipActive,
        activeIndex,
        lastClickedItemIndex,
    });
    const onItemClickRef = useRef(onItemClick);
    const onMoreClickRef = useRef(onMoreClick);
    const setMultipleTooltipContextValueRef = useRef(setMultipleTooltipContextValue);

    React.useLayoutEffect(() => {
        multipleTooltipStateRef.current = {
            active: multipleTooltipActive,
            activeIndex,
            lastClickedItemIndex,
        };
        onItemClickRef.current = onItemClick;
        onMoreClickRef.current = onMoreClick;
        setMultipleTooltipContextValueRef.current = setMultipleTooltipContextValue;
    });

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
                const {
                    active: multipleTooltipActiveValue,
                    activeIndex: currentActiveIndex,
                    lastClickedItemIndex: currentLastClickedItemIndex,
                } = multipleTooltipStateRef.current;
                let nextMultipleTooltipActive = multipleTooltipActiveValue;
                if (!multipleTooltipActiveValue && itemIndex !== currentLastClickedItemIndex) {
                    nextMultipleTooltipActive = true;
                }
                if (
                    currentActiveIndex === itemIndex &&
                    multipleTooltipActiveValue === nextMultipleTooltipActive
                ) {
                    return;
                }
                setMultipleTooltipContextValueRef.current({
                    activeIndex: itemIndex,
                    active: nextMultipleTooltipActive,
                });
            }
        },
        [multipleTooltip],
    );

    const onMouseLeave = useCallback(() => {
        if (compact && document.hasFocus()) {
            ref.current?.activateItem(undefined as unknown as number);
            const {
                activeIndex: currentActiveIndex,
                lastClickedItemIndex: currentLastClickedItemIndex,
            } = multipleTooltipStateRef.current;
            if (
                multipleTooltip &&
                (currentActiveIndex !== undefined || currentLastClickedItemIndex !== undefined)
            ) {
                setMultipleTooltipContextValueRef.current({
                    activeIndex: undefined,
                    lastClickedItemIndex: undefined,
                });
            }
        }
    }, [compact, multipleTooltip]);

    const onItemClickByIndex = useCallback(
        (
            itemIndex: number,
            orginalItemClick: AsideHeaderItem['onItemClick'],
        ): ItemProps['onItemClick'] =>
            (item, collapsed, event) => {
                const {lastClickedItemIndex: currentLastClickedItemIndex} =
                    multipleTooltipStateRef.current;
                if (
                    compact &&
                    multipleTooltip &&
                    itemIndex !== currentLastClickedItemIndex &&
                    item.id !== COLLAPSE_ITEM_ID
                ) {
                    setMultipleTooltipContextValueRef.current({
                        lastClickedItemIndex: itemIndex,
                        active: false,
                    });
                }

                // Handle clicks on the "more" button (collapse item)
                if (item.id === COLLAPSE_ITEM_ID && collapsed) {
                    onMoreClickRef.current?.();
                } else {
                    onItemClickRef.current?.(
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
        [compact, multipleTooltip],
    );

    return (
        <React.Fragment>
            <div
                ref={tooltipRef}
                onMouseEnter={onTooltipMouseEnter}
                onMouseLeave={onTooltipMouseLeave}
            >
                <CompositeBarList
                    compositeId={compositeId}
                    type={type}
                    compact={compact}
                    items={items}
                    listRef={ref}
                    multipleTooltip={multipleTooltip}
                    onItemClickByIndex={onItemClickByIndex}
                    onMouseEnterByIndex={onMouseEnterByIndex}
                    onMouseLeave={onMouseLeave}
                    collapseItems={collapseItems}
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
