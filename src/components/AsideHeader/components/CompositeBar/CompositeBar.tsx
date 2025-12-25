import React, {FC, ReactNode, useCallback, useContext, useRef, useState} from 'react';

import {ChevronDown, ChevronRight} from '@gravity-ui/icons';
import {List, ListSortParams} from '@gravity-ui/uikit';

import {ASIDE_HEADER_COMPACT_WIDTH} from '../../../constants';
import {createBlock} from '../../../utils/cn';
import {AsideHeaderItem, MenuItemsWithGroups} from '../../types';
import {UNGROUPED_ID} from '../AllPagesPanel/constants';

import {Item, ItemProps} from './Item/Item';
import {MultipleTooltip, MultipleTooltipContext, MultipleTooltipProvider} from './MultipleTooltip';
import {COLLAPSE_ITEM_ID, ITEM_TYPE_REGULAR} from './constants';
import {getItemHeight, getItemsHeight, getSelectedItemIndex} from './utils';

import styles from './CompositeBar.module.scss';

const b = createBlock('composite-bar', styles);

type CompositeBarProps = {
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
    menuItemClassName?: string;
    editMode?: boolean;
    onToggleGroupCollapsed?: (groupId: string) => void;
};

type CompositeBarViewProps = CompositeBarProps & {
    compositeId?: string;
    items?: MenuItemsWithGroups[];
    collapsedIds?: Record<string, boolean>;
    enableSorting?: boolean;
    editMode?: boolean;
    onToggleGroupCollapsed?: (groupId: string) => void;
    onToggleMenuItemVisibility?: (item: AsideHeaderItem) => void;
    onToggleMenuGroupVisibility?: (groupId: string) => void;
    onFirstLevelSortEnd?: (params: {oldIndex: number; newIndex: number}) => void;
    onSecondLevelSortEnd?: (
        groupIndex: number,
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
    menuItemClassName,
    enableSorting = false,
    editMode = false,
    compact,
    onToggleGroupCollapsed,
    onToggleMenuGroupVisibility,
    onToggleMenuItemVisibility,
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
        (groupIndex: number) =>
            ({oldIndex, newIndex}: ListSortParams) => {
                if (onSecondLevelSortEnd) {
                    onSecondLevelSortEnd(groupIndex)({oldIndex, newIndex});
                }
            },
        [onSecondLevelSortEnd],
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
                    itemClassName={b('root-menu-item', {compact}, menuItemClassName)}
                    virtualized={false}
                    filterable={false}
                    sortable={enableSorting}
                    onSortEnd={enableSorting ? handleFirstLevelSortEnd : undefined}
                    renderItem={(item, _isItemActive, itemIndex) => {
                        const groupId = item.groupId;
                        const itemType = item.type || ITEM_TYPE_REGULAR;

                        if (!groupId) {
                            return (
                                <Item
                                    {...item}
                                    className={b('menu-item', {compact, type: itemType})}
                                    compact={compact}
                                    editMode={editMode}
                                    onMouseEnter={onMouseEnterByIndex(itemIndex)}
                                    onMouseLeave={onMouseLeave}
                                    onItemClick={onItemClickByIndex(itemIndex, item.onItemClick)}
                                    onToggleVisibility={
                                        onToggleMenuItemVisibility
                                            ? () => onToggleMenuItemVisibility(item)
                                            : undefined
                                    }
                                />
                            );
                        }

                        const isCollapsible = Boolean('collapsible' in item && item.collapsible);
                        const isCollapsed = Boolean('isCollapsed' in item && item.isCollapsed);
                        const groupListItems = ('items' in item && item.items) || [];
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
                                        editMode={editMode}
                                        onMouseEnter={() => {
                                            setHoveredGroupId(item.id);
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredGroupId(null);
                                        }}
                                        onItemClick={onItemClickByIndex(
                                            itemIndex,
                                            onToggleGroupCollapsed
                                                ? () => onToggleGroupCollapsed(groupId)
                                                : undefined,
                                        )}
                                        onToggleVisibility={
                                            onToggleMenuGroupVisibility
                                                ? () => onToggleMenuGroupVisibility(groupId)
                                                : undefined
                                        }
                                    />
                                )}

                                {!isCollapsed && (
                                    <List<MenuItemsWithGroups>
                                        items={groupListItems}
                                        sortable={enableSorting}
                                        onSortEnd={handleSecondLevelSortEnd(itemIndex)}
                                        virtualized={false}
                                        filterable={false}
                                        itemClassName={b('menu-group-item', {
                                            edit: enableSorting,
                                            compact,
                                        })}
                                        itemHeight={getItemHeight}
                                        itemsHeight={getItemsHeight}
                                        renderItem={(
                                            nestedItem,
                                            _isNestedItemActive,
                                            _nestedItemIndex,
                                        ) => {
                                            return (
                                                <Item
                                                    {...nestedItem}
                                                    compact={compact}
                                                    className={b('group-item')}
                                                    editMode={editMode}
                                                    onMouseEnter={() => {
                                                        setHoveredGroupId(nestedItem.id);
                                                    }}
                                                    onMouseLeave={() => {
                                                        setHoveredGroupId(null);
                                                    }}
                                                    onItemClick={onItemClickByIndex(
                                                        itemIndex,
                                                        item.onItemClick,
                                                    )}
                                                    onToggleVisibility={
                                                        onToggleMenuItemVisibility
                                                            ? () =>
                                                                  onToggleMenuItemVisibility(
                                                                      nestedItem,
                                                                  )
                                                            : undefined
                                                    }
                                                />
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
    onToggleGroupCollapsed,
    multipleTooltip = false,
    compact,
    compositeId,
    className,
    menuItemClassName,
    editMode = false,
}) => {
    const visibleItems = items
        ?.filter((item) => !item.hidden)
        ?.map((item) => ({
            ...item,
            items: 'items' in item ? item.items?.filter((item) => !item.hidden) : [],
        }));

    if (!visibleItems || visibleItems.length === 0) {
        return null;
    }

    let node: ReactNode;

    if (type === 'menu') {
        node = (
            <div className={b({scrollable: true}, className)}>
                <CompositeBarView
                    compositeId={compositeId}
                    menuItemClassName={menuItemClassName}
                    type="menu"
                    compact={compact}
                    items={visibleItems}
                    onItemClick={onItemClick}
                    onMoreClick={onMoreClick}
                    multipleTooltip={multipleTooltip}
                    onToggleGroupCollapsed={onToggleGroupCollapsed}
                    editMode={editMode}
                />
            </div>
        );
    } else {
        node = (
            <div className={b({subheader: true}, className)}>
                <CompositeBarView
                    menuItemClassName={menuItemClassName}
                    type="subheader"
                    compact={compact}
                    items={visibleItems}
                    onItemClick={onItemClick}
                    editMode={editMode}
                />
            </div>
        );
    }
    return <MultipleTooltipProvider>{node}</MultipleTooltipProvider>;
};
