import React, {ReactNode, useCallback, useEffect, useRef, useState} from 'react';

import {Gear} from '@gravity-ui/icons';
import {
    Button,
    Flex,
    Icon,
    List,
    ListItemData,
    ListProps,
    ListSortParams,
    Text,
    Tooltip,
} from '@gravity-ui/uikit';

import {block} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';

import {AllPagesGroupHeader} from './AllPagesGroupHeader';
import {AllPagesListItem} from './AllPagesListItem';
import {ALL_PAGES_ID} from './constants';
import i18n from './i18n';
import {MenuItemsWithGroups, useGroupedMenuItems} from './useGroupedMenuItems';
import {buildExpandedFromFlatList} from './utils/buildExpandedFromFlatList';
import {getRealIndexInGroup} from './utils/getRealIndexInGroup';
import {sortMenuItems} from './utils/sortMenuItems';

import './AllPagesPanel.scss';

const b = block('all-pages-panel');

interface AllPagesPanelProps {
    className?: string;
    startEditIcon?: React.ReactNode;
    onEditModeChanged?: (isEditMode: boolean) => void;
}

export const AllPagesPanel: React.FC<AllPagesPanelProps> = (props) => {
    const {startEditIcon, onEditModeChanged, className} = props;
    const {
        defaultMenuItems,
        editMenuProps,
        menuItems,
        menuGroups,
        defaultMenuGroups,
        onMenuItemsChanged,
        onMenuGroupsChanged,
    } = useAsideHeaderInnerContext();
    const items = useGroupedMenuItems(menuItems, menuGroups, true);

    const menuItemsRef = useRef(items);
    menuItemsRef.current = items;

    const menuGroupsRef = useRef(menuGroups);
    menuGroupsRef.current = menuGroups;

    const [isEditMode, setIsEditMode] = useState(true);

    const [draggingItemTitle, setDraggingItemTitle] = useState<ReactNode | null>(null);

    const toggleEditMode = useCallback(() => {
        setIsEditMode((prev) => !prev);
    }, []);

    useEffect(() => {
        onEditModeChanged?.(isEditMode);

        if (isEditMode) {
            editMenuProps?.onOpenEditMode?.();
        }
    }, [isEditMode, onEditModeChanged, editMenuProps]);

    const onItemClick = useCallback<NonNullable<ListProps<MenuItemsWithGroups>['onItemClick']>>(
        (item, _index, _forwardKey, event) => {
            // TODO: make event an optional argument
            item.onItemClick?.(item, false, event as React.MouseEvent<HTMLElement, MouseEvent>);
        },
        [],
    );

    const togglePageVisibility = useCallback(
        (item: MenuItemsWithGroups) => {
            if (!onMenuItemsChanged) {
                return;
            }
            const changedItem: MenuItemsWithGroups = {
                ...item,
                hidden: !item.hidden,
            };

            const originItems = menuItemsRef.current.filter(
                (menuItem) => menuItem.id !== ALL_PAGES_ID,
            );

            editMenuProps?.onToggleMenuItem?.(changedItem);
            onMenuItemsChanged(
                originItems.map((menuItem) => {
                    if (menuItem.id !== changedItem.id) {
                        return menuItem;
                    }
                    return changedItem;
                }),
            );
        },
        [onMenuItemsChanged, editMenuProps],
    );

    const onResetToDefaultClick = useCallback(() => {
        if (!onMenuItemsChanged) {
            return;
        }
        editMenuProps?.onResetSettingsToDefault?.();
        const originItems = defaultMenuItems?.filter(({id}) => id !== ALL_PAGES_ID);

        if (originItems) {
            onMenuItemsChanged(originItems);
        }

        if (onMenuGroupsChanged && defaultMenuGroups) {
            onMenuGroupsChanged(defaultMenuGroups);
        }
    }, [
        onMenuItemsChanged,
        editMenuProps,
        defaultMenuItems,
        onMenuGroupsChanged,
        defaultMenuGroups,
    ]);

    const toggleGroupHidden = useCallback(
        (groupId: string) => {
            if (!onMenuGroupsChanged) {
                return;
            }

            const currentGroups = menuGroupsRef.current || [];
            const updatedGroups = currentGroups.map((group) => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        hidden: !group.hidden,
                    };
                }

                return group;
            });

            onMenuGroupsChanged(updatedGroups);
        },
        [onMenuGroupsChanged],
    );

    const onFirstLevelSortEnd = useCallback(
        ({oldIndex, newIndex}: ListSortParams) => {
            if (!onMenuItemsChanged) {
                return;
            }

            const currentFlatList = menuItemsRef.current || [];

            const updatedItems = sortMenuItems(oldIndex, newIndex, currentFlatList);

            setDraggingItemTitle(null);

            if (updatedItems) {
                onMenuItemsChanged?.(updatedItems);
            }
        },
        [onMenuItemsChanged],
    );

    const onSecondLevelSortEnd = useCallback(
        (groupIndex: number) =>
            ({oldIndex, newIndex}: ListSortParams) => {
                if (!onMenuItemsChanged) {
                    return;
                }

                const currentFlatList = menuItemsRef.current || [];
                const realOldIndex = getRealIndexInGroup(groupIndex, oldIndex, currentFlatList);
                const realNewIndex = getRealIndexInGroup(groupIndex, newIndex, currentFlatList);
                const expandedItems = buildExpandedFromFlatList(currentFlatList);

                const updatedItems = sortMenuItems(realOldIndex, realNewIndex, expandedItems);

                if (updatedItems) {
                    onMenuItemsChanged?.(updatedItems);
                }
            },
        [onMenuItemsChanged],
    );

    const itemRender = useCallback(
        (
            asideHeaderItem: ListItemData<MenuItemsWithGroups>,
            _isActive: boolean,
            _itemIndex: number,
        ) => {
            const onDragStart = () => {
                setDraggingItemTitle(asideHeaderItem.title);
            };
            const onDragEnd = () => {
                setDraggingItemTitle(null);
            };
            return (
                <AllPagesListItem
                    item={asideHeaderItem}
                    editMode={isEditMode}
                    onToggle={() => togglePageVisibility(asideHeaderItem)}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    enableSorting={editMenuProps?.enableSorting}
                />
            );
        },
        [isEditMode, editMenuProps?.enableSorting, togglePageVisibility],
    );

    const renderFirstLevelItem = useCallback(
        (
            firstLevelItem: ListItemData<MenuItemsWithGroups>,
            _isActive: boolean,
            _itemIndex: number,
        ) => {
            const groupListItems = firstLevelItem.items;

            if (!groupListItems || groupListItems.length === 0) {
                return itemRender(firstLevelItem, _isActive, _itemIndex);
            }

            const sortableGroupItems =
                isEditMode && editMenuProps?.enableSorting
                    ? groupListItems.filter(
                          ({id, afterMoreButton, type}) =>
                              !afterMoreButton && type !== 'divider' && id !== ALL_PAGES_ID,
                      )
                    : groupListItems;

            if (sortableGroupItems.length === 0) {
                return null;
            }

            return (
                <Flex className={b('groups-container')} direction="column">
                    {firstLevelItem.title && (
                        <AllPagesGroupHeader
                            id={firstLevelItem.id}
                            icon={firstLevelItem.icon}
                            title={firstLevelItem.title}
                            hidden={Boolean(firstLevelItem.hidden)}
                            onToggleHidden={toggleGroupHidden}
                            editMode={isEditMode}
                        />
                    )}
                    <List
                        itemClassName={
                            isEditMode && editMenuProps?.enableSorting
                                ? b('item', {editMode: true})
                                : undefined
                        }
                        itemHeight={isEditMode && editMenuProps?.enableSorting ? 40 : undefined}
                        onSortEnd={
                            isEditMode && editMenuProps?.enableSorting
                                ? onSecondLevelSortEnd(_itemIndex)
                                : undefined
                        }
                        sortable={isEditMode && editMenuProps?.enableSorting}
                        virtualized={false}
                        filterable={false}
                        items={sortableGroupItems}
                        onItemClick={onItemClick}
                        renderItem={itemRender}
                    />
                </Flex>
            );
        },
        [
            isEditMode,
            editMenuProps,
            toggleGroupHidden,
            onSecondLevelSortEnd,
            onItemClick,
            itemRender,
        ],
    );

    return (
        <Flex className={b(null, className)} gap="5" direction="column">
            <Flex gap="4" alignItems="center" justifyContent="space-between">
                <Text variant="subheader-2">
                    {isEditMode ? i18n('all-panel.title.editing') : i18n('all-panel.title.main')}
                </Text>

                <Tooltip content={i18n('all-panel.title.editing')}>
                    <Button selected={isEditMode} view="normal" onClick={toggleEditMode}>
                        {startEditIcon ? startEditIcon : <Icon data={Gear} />}
                    </Button>
                </Tooltip>
            </Flex>

            <Flex className={b('content', {'edit-mode': isEditMode})} gap="2" direction="column">
                <List
                    onSortEnd={
                        isEditMode && editMenuProps?.enableSorting ? onFirstLevelSortEnd : undefined
                    }
                    sortable={isEditMode && editMenuProps?.enableSorting}
                    virtualized={false}
                    filterable={false}
                    items={items}
                    renderItem={renderFirstLevelItem}
                />

                {isEditMode && editMenuProps?.enableSorting && draggingItemTitle && (
                    <div className={b('drag-placeholder')}>{draggingItemTitle}</div>
                )}
            </Flex>
            {isEditMode && (
                <Button onClick={onResetToDefaultClick}>{i18n('all-panel.resetToDefault')}</Button>
            )}
        </Flex>
    );
};
