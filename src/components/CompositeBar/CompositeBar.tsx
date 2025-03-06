import React, {FC, ReactNode, useCallback, useContext, useRef} from 'react';

import {List} from '@gravity-ui/uikit';
import debounce from 'lodash/debounce';
import AutoSizer, {Size} from 'react-virtualized-auto-sizer';

import {useAsideHeaderContext} from '../AsideHeader/AsideHeaderContext';
import {ASIDE_HEADER_COMPACT_WIDTH} from '../constants';
import {MenuItem, SubheaderMenuItem} from '../types';
import {block} from '../utils/cn';

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
    isMenuItem,
} from './utils';

import './CompositeBar.scss';

const DEFAULT_DEBOUNCE_INTERVAL = 10;

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
    onMoreClick?: () => void;
};

type CompositeBarViewProps = CompositeBarProps & {
    collapseItems?: MenuItem[];
};

function getTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    const formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    return formattedTime;
}

const CompositeBarView: FC<CompositeBarViewProps> = ({
    type,
    items,
    onItemClick,
    onMoreClick,
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
        hoverState,
    } = useContext(MultipleTooltipContext);
    const {compact} = useAsideHeaderContext();
    const [needRecalcTooltip, setNeedRecalcTooltip] = React.useState(false);
    const prevHoverStateRef = React.useRef<boolean | undefined>();

    const handleTransitionRun = React.useCallback<(e: TransitionEvent) => void>(
        (e) => {
            if (e.target && e.target === ref.current?.refContainer.current?.node) {
                const computedStyle = getComputedStyle(e.target as HTMLElement);
                const isHovered = computedStyle.transform !== 'none';
                console.log('isHovered=', isHovered, getTime());
                if (hoverState !== isHovered) {
                    prevHoverStateRef.current = !isHovered;
                    console.log('prevHoverStateRef.current=', prevHoverStateRef.current);
                    setMultipleTooltipContextValue({hoverState: isHovered});
                    setNeedRecalcTooltip(true);
                }
            }
        },
        [multipleTooltip, multipleTooltipActive],
    );

    React.useEffect(() => {
        if (ref.current?.refContainer.current?.node) {
            const listNode = ref.current.refContainer.current.node as HTMLElement;
            // this hack allow to detect hover events on element like browser css engine
            listNode.style.setProperty('transition', 'transform 0.001ms step-start');
            listNode.style.setProperty('transition-behavior', 'allow-discrete');
            listNode.addEventListener('transitionrun', handleTransitionRun);

            return () => {
                listNode.removeEventListener('transitionrun', handleTransitionRun);
                listNode.style.removeProperty('transition-behavior');
                listNode.style.removeProperty('transition');
            };
        }

        return;
    }, []);

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
        debounce(
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
            DEFAULT_DEBOUNCE_INTERVAL,
            {
                leading: true,
                trailing: false,
            },
        ),
        [
            multipleTooltip,
            compact,
            multipleTooltipActive,
            activeIndex,
            lastClickedItemIndex,
            setMultipleTooltipContextValue,
        ],
    );

    const onTooltipMouseLeave = useCallback(
        debounce(
            () => {
                if (multipleTooltip && multipleTooltipActive && document.hasFocus()) {
                    setMultipleTooltipContextValue?.({
                        active: false,
                        activeIndex: undefined,
                        lastClickedItemIndex: undefined,
                    });
                }
            },
            DEFAULT_DEBOUNCE_INTERVAL,
            {
                leading: true,
                trailing: false,
            },
        ),
        [multipleTooltip, multipleTooltipActive, setMultipleTooltipContextValue],
    );

    const onMouseEnterByIndex = useCallback(
        (itemIndex: number) =>
            debounce(
                () => {
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
                DEFAULT_DEBOUNCE_INTERVAL,
                {
                    leading: true,
                    trailing: false,
                },
            ),
        [
            multipleTooltip,
            multipleTooltipActive,
            lastClickedItemIndex,
            activeIndex,
            setMultipleTooltipContextValue,
        ],
    );

    const onMouseLeave = useCallback(
        debounce(
            () => {
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
            },
            DEFAULT_DEBOUNCE_INTERVAL,
            {
                leading: true,
                trailing: false,
            },
        ),
        [
            activeIndex,
            compact,
            lastClickedItemIndex,
            multipleTooltip,
            setMultipleTooltipContextValue,
        ],
    );

    const onItemClickByIndex = useCallback(
        (itemIndex: number): ItemProps['onItemClick'] =>
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
        [
            compact,
            lastClickedItemIndex,
            multipleTooltip,
            onItemClick,
            setMultipleTooltipContextValue,
        ],
    );

    React.useEffect(() => {
        console.log(`useEffect: hover=${hoverState}, prevHoverState=${prevHoverStateRef.current}`);
        if (needRecalcTooltip && hoverState !== prevHoverStateRef.current) {
            console.log(
                `needRecalcTooltip: hover=${hoverState}, active=${multipleTooltipActive}, activeIndex=${activeIndex}`,
            );
            setMultipleTooltipContextValue({
                active: multipleTooltipActive && hoverState === true,
            });
            setNeedRecalcTooltip(false);
        }
    }, [needRecalcTooltip, hoverState]);

    return (
        <React.Fragment>
            <div
                ref={tooltipRef}
                onMouseEnter={onTooltipMouseEnter}
                onMouseLeave={onTooltipMouseLeave}
            >
                <List<CompositeBarItem>
                    className={b('list', {hover: hoverState})}
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
                                onCollapseItemClick={onMoreClick}
                                collapseItems={collapseItems}
                            />
                        );
                    }}
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
                                        type="menu"
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
                <CompositeBarView type="subheader" items={items} onItemClick={onItemClick} />
            </div>
        );
    }
    return <MultipleTooltipProvider>{node}</MultipleTooltipProvider>;
};
