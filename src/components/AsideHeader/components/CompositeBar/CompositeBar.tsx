import React, {FC, ReactNode, useCallback, useContext, useRef} from 'react';

import {ChevronDown, ChevronUp} from '@gravity-ui/icons';
import {Button, Flex, Icon, List, Text} from '@gravity-ui/uikit';

import {ASIDE_HEADER_COMPACT_WIDTH} from '../../../constants';
import {block} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import {AsideHeaderItem} from '../../types';
import {UNGROUPED_ID} from '../AllPagesPanel/constants';
import {MenuItemsWithGroups} from '../AllPagesPanel/useGroupedMenuItems';

import {Item, ItemProps} from './Item/Item';
import {MultipleTooltip, MultipleTooltipContext, MultipleTooltipProvider} from './MultipleTooltip';
import {COLLAPSE_ITEM_ID} from './constants';
import {
    getItemHeight,
    getItemsHeight,
    getSelectedItemIndex,
    sortItemsByAfterMoreButton,
} from './utils';

import './CompositeBar.scss';

const b = block('composite-bar');

export type CompositeBarProps = {
    type: 'menu' | 'subheader';

    items?: MenuItemsWithGroups[];
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
    className?: string;
    onToggleMenuGroupVisibility?: (groupId: string) => void;
};

type CompositeBarViewProps = CompositeBarProps & {
    compositeId?: string;
    items?: MenuItemsWithGroups[];
    collapsedIds?: Record<string, boolean>;
    onToggleMenuGroupVisibility?: (groupId: string) => void;
};

const CompositeBarView: FC<CompositeBarViewProps> = ({
    type,
    items,
    onItemClick,
    onMoreClick,
    multipleTooltip = false,
    compositeId,
    className,
    onToggleMenuGroupVisibility,
}) => {
    const ref = useRef<List<AsideHeaderItem>>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const {
        setValue: setMultipleTooltipContextValue,
        active: multipleTooltipActive,
        activeIndex,
        lastClickedItemIndex,
    } = useContext(MultipleTooltipContext);
    const {isExpanded} = useAsideHeaderInnerContext();
    const compact = !isExpanded;

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

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <React.Fragment>
            <div
                className={className}
                ref={tooltipRef}
                onMouseEnter={onTooltipMouseEnter}
                onMouseLeave={onTooltipMouseLeave}
            >
                <List<MenuItemsWithGroups>
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
                    renderItem={(item, _isItemActive, itemIndex) => {
                        if (!item.groupId) {
                            return (
                                <Item
                                    {...item}
                                    compact={compact}
                                    onMouseEnter={onMouseEnterByIndex(itemIndex)}
                                    onMouseLeave={onMouseLeave}
                                    onItemClick={onItemClickByIndex(itemIndex, item.onItemClick)}
                                />
                            );
                        }

                        const isCollapsible = Boolean(item.collapsible);
                        const isCollapsed = item.isCollapsed;
                        const groupListItems = item.items?.filter((item) => !item.hidden);
                        const hasHeader = item.title || item.icon || isCollapsible;

                        const sortedItems = sortItemsByAfterMoreButton(groupListItems || []);
                        const isUngrouped = item.id === UNGROUPED_ID;

                        return (
                            <div>
                                {hasHeader && !isUngrouped && (
                                    <Flex
                                        className={b('menu-group-header')}
                                        gap="2"
                                        alignItems="center"
                                    >
                                        {item.icon ? (
                                            <Icon
                                                data={item.icon}
                                                size={16}
                                                className={b('menu-group-icon')}
                                            />
                                        ) : null}

                                        <Text variant="body-1">{item.title}</Text>

                                        {isCollapsible ? (
                                            <Button
                                                view="flat-secondary"
                                                size="s"
                                                className={b('menu-group-toggle')}
                                                onClick={() =>
                                                    onToggleMenuGroupVisibility?.(item.id)
                                                }
                                                aria-label={
                                                    isCollapsed ? 'Expand group' : 'Collapse group'
                                                }
                                            >
                                                <Icon
                                                    data={isCollapsed ? ChevronUp : ChevronDown}
                                                    size={14}
                                                />
                                            </Button>
                                        ) : (
                                            <span className={b('menu-group-toggle-placeholder')} />
                                        )}
                                    </Flex>
                                )}

                                {!isCollapsed && (
                                    <div
                                        className={b(
                                            'menu-group-items',
                                            {grouped: !isUngrouped},
                                            className,
                                        )}
                                    >
                                        {sortedItems?.map((item) => (
                                            <Item
                                                className={b('menu-group-item')}
                                                key={item.id}
                                                {...item}
                                                compact={compact}
                                                onMouseEnter={onMouseEnterByIndex(itemIndex)}
                                                onMouseLeave={onMouseLeave}
                                                onItemClick={onItemClickByIndex(
                                                    itemIndex,
                                                    item.onItemClick,
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
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
    onItemClick,
    onMoreClick,
    onToggleMenuGroupVisibility,
    multipleTooltip = false,
    compact,
    compositeId,
    className,
}) => {
    const visibleItems = items?.filter((item) => !item.hidden);

    if (!items || items.length === 0) {
        return null;
    }

    let node: ReactNode;

    if (type === 'menu') {
        node = (
            <div className={b({scrollable: true}, className)}>
                <CompositeBarView
                    compositeId={compositeId}
                    type="menu"
                    compact={compact}
                    items={visibleItems}
                    onItemClick={onItemClick}
                    onMoreClick={onMoreClick}
                    multipleTooltip={multipleTooltip}
                    onToggleMenuGroupVisibility={onToggleMenuGroupVisibility}
                />
            </div>
        );
    } else {
        const sortedItems = sortItemsByAfterMoreButton(items);

        node = (
            <div className={b({subheader: true}, className)}>
                <CompositeBarView
                    type="subheader"
                    compact={compact}
                    items={sortedItems}
                    onItemClick={onItemClick}
                    onToggleMenuGroupVisibility={onToggleMenuGroupVisibility}
                />
            </div>
        );
    }

    return <MultipleTooltipProvider>{node}</MultipleTooltipProvider>;
};
