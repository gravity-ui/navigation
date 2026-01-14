import React, {FC, useCallback, useRef, useState} from 'react';

import {ChevronRight} from '@gravity-ui/icons';
import {List, ListSortParams} from '@gravity-ui/uikit';

import {createBlock} from '../../../utils/cn';
import {AsideHeaderItem, MenuItemsWithGroups} from '../../types';
import {UNGROUPED_ID} from '../AllPagesPanel/constants';

import {Item, ItemProps} from './Item/Item';
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
    menuMoreTitle?: string;
    onMoreClick?: () => void;
    /** When `true`, the navigation is expanded. When `false`, it is collapsed. */
    isExpanded: boolean;
    compositeId?: string;
    className?: string;
    menuItemClassName?: string;
    editMode?: boolean;
    onToggleGroupCollapsed?: (groupId: string) => void;
    /** When `true`, menu items use compact height. */
    isCompactMode?: boolean;
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
    /** When `true`, menu items use compact height. */
    isCompactMode?: boolean;
};

export const CompositeBarView: FC<CompositeBarViewProps> = ({
    type,
    items,
    onItemClick,
    onMoreClick,
    compositeId,
    className,
    menuItemClassName,
    enableSorting = false,
    editMode = false,
    isExpanded,
    onToggleGroupCollapsed,
    onToggleMenuGroupVisibility,
    onToggleMenuItemVisibility,
    onFirstLevelSortEnd,
    onSecondLevelSortEnd,
    isCompactMode,
}) => {
    const ref = useRef<List<AsideHeaderItem>>(null);
    const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);

    const onMouseLeave = useCallback(() => {
        if (!isExpanded && document.hasFocus()) {
            ref.current?.activateItem(undefined as unknown as number);
        }
    }, [isExpanded]);

    const onItemClickByIndex = useCallback(
        (
            _itemIndex: number,
            orginalItemClick: AsideHeaderItem['onItemClick'],
        ): ItemProps['onItemClick'] =>
            (item, collapsed, event) => {
                // Handle clicks on the "more" button (collapse item)
                if (item.id === COLLAPSE_ITEM_ID && collapsed) {
                    onMoreClick?.();
                } else {
                    onItemClick?.({...item, onItemClick: orginalItemClick}, collapsed, event);
                }
            },
        [onItemClick, onMoreClick],
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
        <div className={className}>
            <List<MenuItemsWithGroups>
                id={compositeId}
                ref={ref}
                items={items}
                selectedItemIndex={type === 'menu' ? getSelectedItemIndex(items) : undefined}
                itemHeight={(item) => getItemHeight(item, isCompactMode)}
                itemsHeight={(items) => getItemsHeight(items, isCompactMode)}
                itemClassName={b('root-menu-item', {collapsed: !isExpanded}, menuItemClassName)}
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
                                className={b('menu-item', {
                                    collapsed: !isExpanded,
                                    type: itemType,
                                })}
                                isExpanded={isExpanded}
                                editMode={editMode}
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

                    if (isGroupHovered) {
                        groupIcon = ChevronRight;
                    }

                    return (
                        <div className={b('menu-group', {expanded: !isCollapsed, wrapper: true})}>
                            {hasHeader && !isUngrouped && (
                                <Item
                                    {...item}
                                    className={b('menu-group-header', {collapsed: isCollapsed})}
                                    icon={groupIcon}
                                    isExpanded={isExpanded}
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
                                        collapsed: !isExpanded,
                                    })}
                                    itemHeight={(item) => getItemHeight(item, isCompactMode)}
                                    itemsHeight={(items) => getItemsHeight(items, isCompactMode)}
                                    renderItem={(
                                        nestedItem,
                                        _isNestedItemActive,
                                        nestedItemIndex,
                                    ) => {
                                        return (
                                            <Item
                                                {...nestedItem}
                                                isExpanded={isExpanded}
                                                className={b('group-item')}
                                                editMode={editMode}
                                                onMouseEnter={() => {
                                                    setHoveredGroupId(nestedItem.id);
                                                }}
                                                onMouseLeave={() => {
                                                    setHoveredGroupId(null);
                                                }}
                                                onItemClick={onItemClickByIndex(
                                                    // +1 because the first item is the group header
                                                    itemIndex + nestedItemIndex + 1,
                                                    nestedItem.onItemClick,
                                                )}
                                                onToggleVisibility={
                                                    onToggleMenuItemVisibility
                                                        ? () =>
                                                              onToggleMenuItemVisibility(nestedItem)
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
    );
};

export const CompositeBar: FC<CompositeBarProps> = ({
    type,
    items,
    onItemClick,
    onMoreClick,
    onToggleGroupCollapsed,
    isExpanded,
    compositeId,
    className,
    menuItemClassName,
    editMode = false,
    isCompactMode,
}) => {
    const visibleItems = items
        ?.filter((item) => !item.hidden)
        ?.map((item) => ({
            ...item,
            items: 'items' in item ? item.items?.filter((nestedItem) => !nestedItem.hidden) : [],
        }));

    if (!visibleItems || visibleItems.length === 0) {
        return null;
    }

    if (type === 'menu') {
        return (
            <div className={b({scrollable: true}, className)}>
                <CompositeBarView
                    compositeId={compositeId}
                    menuItemClassName={menuItemClassName}
                    type="menu"
                    isExpanded={isExpanded}
                    items={visibleItems}
                    onItemClick={onItemClick}
                    onMoreClick={onMoreClick}
                    onToggleGroupCollapsed={onToggleGroupCollapsed}
                    editMode={editMode}
                    isCompactMode={isCompactMode}
                />
            </div>
        );
    }

    return (
        <div className={b({subheader: true}, className)}>
            <CompositeBarView
                menuItemClassName={menuItemClassName}
                type="subheader"
                isExpanded={isExpanded}
                items={visibleItems}
                onItemClick={onItemClick}
                editMode={editMode}
                isCompactMode={isCompactMode}
            />
        </div>
    );
};
