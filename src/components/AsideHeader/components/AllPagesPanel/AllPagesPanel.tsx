import React, {ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {Gear} from '@gravity-ui/icons';
import {Button, Flex, Icon, List, ListItemData, ListProps, Text, Tooltip} from '@gravity-ui/uikit';

import {block} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import {AsideHeaderItem} from '../../types';

import {AllPagesGroupHeader} from './AllPagesGroupHeader';
import {AllPagesListItem} from './AllPagesListItem';
import {ALL_PAGES_ID} from './constants';
import i18n from './i18n';
import {useGroupedMenuItems} from './useGroupedMenuItems';

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
        menuItems,
        defaultMenuItems,
        onMenuItemsChanged,
        editMenuProps,
        menuGroups,
        defaultMenuGroups,
        onMenuGroupsChanged,
    } = useAsideHeaderInnerContext();

    const menuItemsRef = useRef(menuItems);
    menuItemsRef.current = menuItems;

    const menuGroupsRef = useRef(menuGroups);
    menuGroupsRef.current = menuGroups;

    const [isEditMode, setIsEditMode] = useState(false);

    const [draggingItemTitle, setDraggingItemTitle] = useState<ReactNode | null>(null);

    const toggleEditMode = useCallback(() => {
        setIsEditMode((prev) => !prev);
    }, []);

    const groupedItems = useGroupedMenuItems(menuItems);

    useEffect(() => {
        onEditModeChanged?.(isEditMode);

        if (isEditMode) {
            editMenuProps?.onOpenEditMode?.();
        }
    }, [isEditMode, onEditModeChanged, editMenuProps]);

    const onItemClick = useCallback<NonNullable<ListProps<AsideHeaderItem>['onItemClick']>>(
        (item, _index, _forwardKey, event) => {
            // TODO: make event an optional argument
            item.onItemClick?.(item, false, event as React.MouseEvent<HTMLElement, MouseEvent>);
        },
        [],
    );

    const togglePageVisibility = useCallback(
        (item: AsideHeaderItem) => {
            if (!onMenuItemsChanged) {
                return;
            }
            const changedItem: AsideHeaderItem = {
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

    const onDragEnd = useCallback(() => {
        setDraggingItemTitle(null);
    }, [setDraggingItemTitle]);

    const itemRender = useCallback(
        (
            asideHeaderItem: ListItemData<AsideHeaderItem>,
            _isActive: boolean,
            _itemIndex: number,
        ) => {
            const onDragStart = () => {
                setDraggingItemTitle(asideHeaderItem.title);
            };

            return (
                <AllPagesListItem
                    item={asideHeaderItem}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    editMode={isEditMode}
                    onToggle={() => togglePageVisibility(asideHeaderItem)}
                    enableSorting={editMenuProps?.enableSorting}
                />
            );
        },
        [isEditMode, togglePageVisibility, onDragEnd, setDraggingItemTitle, editMenuProps],
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

    const createChangeItemsOrderHandler = useCallback(
        (groupId: string, groupItems: AsideHeaderItem[]) => {
            return ({oldIndex, newIndex}: {oldIndex: number; newIndex: number}) => {
                // Check if indices are within group bounds
                if (
                    oldIndex < 0 ||
                    oldIndex >= groupItems.length ||
                    newIndex < 0 ||
                    newIndex >= groupItems.length
                ) {
                    return;
                }

                // Get item being moved
                const element = groupItems[oldIndex];

                // Check that element belongs to this group
                if (element.groupId !== groupId) {
                    return;
                }

                // Reorder within group
                const newGroupItems = [...groupItems];
                const [removed] = newGroupItems.splice(oldIndex, 1);
                newGroupItems.splice(newIndex, 0, removed);

                // Update order property
                const updatedGroupItems = newGroupItems.map((item, index) => ({
                    ...item,
                    order: index,
                }));

                // Rebuild all items with updated group
                const allItems = menuItemsRef.current.filter(({id}) => id !== ALL_PAGES_ID);
                const otherItems = allItems.filter((item) => item.groupId !== groupId);

                const updatedItems = [...otherItems, ...updatedGroupItems].sort((itemA, itemB) => {
                    // Maintain group order, then item order within group
                    const aGroupId = itemA.groupId || 'ungrouped';
                    const bGroupId = itemB.groupId || 'ungrouped';

                    if (aGroupId !== bGroupId) {
                        const aGroup = menuGroupsRef.current?.find((g) => g.id === aGroupId);
                        const bGroup = menuGroupsRef.current?.find((g) => g.id === bGroupId);
                        const aOrder = aGroup?.order || 0;
                        const bOrder = bGroup?.order || 0;
                        if (aOrder !== bOrder) {
                            return aOrder - bOrder;
                        }
                        return aGroupId.localeCompare(bGroupId);
                    }
                    return (itemA.order || 0) - (itemB.order || 0);
                });

                onMenuItemsChanged?.(updatedItems.filter(({type}) => type !== 'divider'));

                setDraggingItemTitle(null);
                editMenuProps?.onChangeItemsOrder?.(element, oldIndex, newIndex);
            };
        },
        [onMenuItemsChanged, editMenuProps],
    );

    const groupedItemsForEdit = useMemo(() => {
        return groupedItems.map((groupWithItems) => {
            const originalGroup = menuGroups?.find((g) => g.id === groupWithItems.group.id);
            return {
                ...groupWithItems,
                group: {
                    ...groupWithItems.group,
                    hidden: originalGroup?.hidden || false,
                },
            };
        });
    }, [groupedItems, menuGroups]);

    const groupedItemsForDisplay = useMemo(() => {
        return groupedItemsForEdit.filter((groupWithItems) => !groupWithItems.group.hidden);
    }, [groupedItemsForEdit]);

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

            <Flex className={b('content')} gap="2" direction="column">
                {isEditMode && editMenuProps?.enableSorting ? (
                    <>
                        {groupedItemsForEdit.map((groupWithItems) => {
                            const sortableGroupItems = groupWithItems.items.filter(
                                ({afterMoreButton, type}) => !afterMoreButton && type !== 'divider',
                            );

                            // In edit mode, show all groups (including hidden ones and empty ones)
                            return (
                                <Flex
                                    className={b('groups-container')}
                                    key={groupWithItems.group.id}
                                    direction="column"
                                    gap="3"
                                >
                                    <AllPagesGroupHeader
                                        group={groupWithItems.group}
                                        onToggleHidden={toggleGroupHidden}
                                        editMode={isEditMode}
                                    />
                                    {sortableGroupItems.length > 0 && (
                                        <List
                                            itemClassName={b('item', {editMode: true})}
                                            itemHeight={40}
                                            onSortEnd={createChangeItemsOrderHandler(
                                                groupWithItems.group.id,
                                                sortableGroupItems,
                                            )}
                                            sortable
                                            virtualized={false}
                                            filterable={false}
                                            items={sortableGroupItems}
                                            onItemClick={onItemClick}
                                            renderItem={itemRender}
                                        />
                                    )}
                                </Flex>
                            );
                        })}

                        {draggingItemTitle && (
                            <div className={b('drag-placeholder')}>{draggingItemTitle}</div>
                        )}
                    </>
                ) : (
                    groupedItemsForDisplay.map((groupWithItems) => {
                        if (groupWithItems.items.length === 0) {
                            return null;
                        }

                        return (
                            <Flex
                                key={groupWithItems.group.id}
                                direction="column"
                                gap="3"
                                className={b('groups-container')}
                            >
                                {groupWithItems.group.title && (
                                    <AllPagesGroupHeader
                                        group={groupWithItems.group}
                                        onToggleHidden={toggleGroupHidden}
                                        editMode={isEditMode}
                                    />
                                )}

                                <List
                                    virtualized={false}
                                    filterable={false}
                                    items={groupWithItems.items}
                                    onItemClick={onItemClick}
                                    renderItem={itemRender}
                                />
                            </Flex>
                        );
                    })
                )}
            </Flex>
            {isEditMode && (
                <Button onClick={onResetToDefaultClick}>{i18n('all-panel.resetToDefault')}</Button>
            )}
        </Flex>
    );
};
