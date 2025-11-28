import React, {FC, ReactNode, useCallback, useContext, useRef, useState} from 'react';

import {ChevronDown, ChevronRight} from '@gravity-ui/icons';
import {List, ListSortParams} from '@gravity-ui/uikit';

import {ASIDE_HEADER_COMPACT_WIDTH} from '../../../constants';
import {block} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import {AsideHeaderItem, MenuItemsWithGroups} from '../../types';
import {UNGROUPED_ID} from '../AllPagesPanel/constants';

import {Item, ItemProps} from './Item/Item';
import {MultipleTooltip, MultipleTooltipContext, MultipleTooltipProvider} from './MultipleTooltip';
import {COLLAPSE_ITEM_ID} from './constants';
import {getItemHeight, getItemsHeight, getSelectedItemIndex} from './utils';

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
    enableSorting?: boolean;
    onFirstLevelSortEnd?: (params: {oldIndex: number; newIndex: number}) => void;
    onSecondLevelSortEnd?: (
        groupId: string,
    ) => (params: {oldIndex: number; newIndex: number}) => void;
};

export const CompositeBarView: FC<CompositeBarViewProps> = ({
    type,
    items,
    onItemClick,
    onMoreClick,
    multipleTooltip = false,
    compositeId,
    className,
    onToggleMenuGroupVisibility,
    enableSorting = false,
    onFirstLevelSortEnd,
    onSecondLevelSortEnd,
}) => {
    const ref = useRef<List<AsideHeaderItem>>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);

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

    const handleFirstLevelSortEnd = useCallback(
        ({oldIndex, newIndex}: ListSortParams) => {
            if (onFirstLevelSortEnd) {
                onFirstLevelSortEnd({oldIndex, newIndex});
            }
        },
        [onFirstLevelSortEnd],
    );

    const handleSecondLevelSortEnd = useCallback(
        (groupId: string) =>
            ({oldIndex, newIndex}: ListSortParams) => {
                if (onSecondLevelSortEnd) {
                    onSecondLevelSortEnd(groupId)({oldIndex, newIndex});
                }
            },
        [onSecondLevelSortEnd],
    );

    const renderNestedItem = useCallback(
        (
            nestedItem: MenuItemsWithGroups,
            parentItemIndex: number,
            _nestedItemIndex: number,
            _parentGroupId?: string,
        ) => {
            if ('items' in nestedItem && nestedItem.items && nestedItem.items.length > 0) {
                const isCollapsible = Boolean(
                    'collapsible' in nestedItem && nestedItem.collapsible,
                );
                const isCollapsed = Boolean('isCollapsed' in nestedItem && nestedItem.isCollapsed);
                const nestedGroupListItems = nestedItem.items?.filter((item) => !item.hidden) || [];
                const hasHeader = nestedItem.title || nestedItem.icon || isCollapsible;
                const isNestedGroupHovered = hoveredGroupId === nestedItem.id;

                let nestedGroupIcon = nestedItem.icon;

                if (!isCollapsed) {
                    nestedGroupIcon = ChevronDown;
                } else if (isNestedGroupHovered) {
                    nestedGroupIcon = ChevronRight;
                }

                return (
                    <div className={b('menu-group', {expanded: !isCollapsed, nested: true})}>
                        {hasHeader && (
                            <Item
                                {...nestedItem}
                                className={b('menu-group-header', {collapsed: isCollapsed})}
                                icon={nestedGroupIcon}
                                compact={compact}
                                onMouseEnter={() => {
                                    setHoveredGroupId(nestedItem.id);
                                }}
                                onMouseLeave={() => {
                                    setHoveredGroupId(null);
                                }}
                                onItemClick={(item) => {
                                    onToggleMenuGroupVisibility?.(item.id);
                                }}
                            />
                        )}

                        {!isCollapsed && (
                            <List<MenuItemsWithGroups>
                                items={nestedGroupListItems}
                                sortable={enableSorting}
                                onSortEnd={handleSecondLevelSortEnd(nestedItem.id)}
                                virtualized={false}
                                filterable={false}
                                itemClassName={b('menu-group-item')}
                                itemsHeight={getItemsHeight}
                                renderItem={(
                                    deepNestedItem,
                                    _isDeepItemActive,
                                    deepNestedIndex,
                                ) => {
                                    return renderNestedItem(
                                        deepNestedItem,
                                        parentItemIndex,
                                        deepNestedIndex,
                                        nestedItem.id,
                                    );
                                }}
                            />
                        )}
                    </div>
                );
            }

            return (
                <Item
                    className={b('menu-group-item')}
                    key={nestedItem.id}
                    {...nestedItem}
                    compact={compact}
                    onMouseEnter={onMouseEnterByIndex(parentItemIndex)}
                    onMouseLeave={onMouseLeave}
                    onItemClick={onItemClickByIndex(parentItemIndex, nestedItem.onItemClick)}
                />
            );
        },
        [
            compact,
            enableSorting,
            handleSecondLevelSortEnd,
            hoveredGroupId,
            onItemClickByIndex,
            onMouseEnterByIndex,
            onMouseLeave,
            onToggleMenuGroupVisibility,
            setHoveredGroupId,
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
                    sortable={enableSorting}
                    onSortEnd={enableSorting ? handleFirstLevelSortEnd : undefined}
                    renderItem={(item, _isItemActive, itemIndex) => {
                        if (!item.groupId) {
                            return (
                                <Item
                                    {...item}
                                    className={b('menu-item', {compact})}
                                    compact={compact}
                                    onMouseEnter={onMouseEnterByIndex(itemIndex)}
                                    onMouseLeave={onMouseLeave}
                                    onItemClick={onItemClickByIndex(itemIndex, item.onItemClick)}
                                />
                            );
                        }

                        const isCollapsible = Boolean('collapsible' in item && item.collapsible);
                        const isCollapsed = Boolean('isCollapsed' in item && item.isCollapsed);
                        const groupListItems =
                            ('items' in item &&
                                item.items?.filter((groupItem) => !groupItem.hidden)) ||
                            [];
                        const hasHeader = item.title || item.icon || isCollapsible;

                        const isUngrouped = item.id === UNGROUPED_ID;
                        const isGroupHovered = hoveredGroupId === item.id;

                        let groupIcon = item.icon;

                        if (!isCollapsed) {
                            groupIcon = ChevronDown;
                        } else if (isGroupHovered) {
                            groupIcon = ChevronRight;
                        }

                        return (
                            <div className={b('menu-group', {expanded: !isCollapsed})}>
                                {hasHeader && !isUngrouped && (
                                    <Item
                                        {...item}
                                        className={b('menu-group-header', {collapsed: isCollapsed})}
                                        icon={groupIcon}
                                        compact={compact}
                                        onMouseEnter={() => {
                                            setHoveredGroupId(item.id);
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredGroupId(null);
                                        }}
                                        onItemClick={(clickedItem) => {
                                            onToggleMenuGroupVisibility?.(clickedItem.id);
                                        }}
                                    />
                                )}

                                {!isCollapsed && (
                                    <List<MenuItemsWithGroups>
                                        items={groupListItems}
                                        sortable={enableSorting}
                                        onSortEnd={handleSecondLevelSortEnd(item.id)}
                                        virtualized={false}
                                        filterable={false}
                                        itemClassName={b('menu-group-item')}
                                        itemHeight={getItemHeight}
                                        itemsHeight={getItemsHeight}
                                        renderItem={(
                                            nestedItem,
                                            _isNestedItemActive,
                                            nestedItemIndex,
                                        ) => {
                                            return renderNestedItem(
                                                nestedItem,
                                                itemIndex,
                                                nestedItemIndex,
                                                item.id,
                                            );
                                        }}
                                    />
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

    if (!visibleItems || visibleItems.length === 0) {
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
        node = (
            <div className={b({subheader: true}, className)}>
                <CompositeBarView
                    type="subheader"
                    compact={compact}
                    items={visibleItems}
                    onItemClick={onItemClick}
                    onToggleMenuGroupVisibility={onToggleMenuGroupVisibility}
                />
            </div>
        );
    }

    return <MultipleTooltipProvider>{node}</MultipleTooltipProvider>;
};
