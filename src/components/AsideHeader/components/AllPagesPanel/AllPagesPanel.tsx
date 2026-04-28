import React, {ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {Gear} from '@gravity-ui/icons';
import {Button, Flex, Icon, List, ListItemData, ListProps, Text, Tooltip} from '@gravity-ui/uikit';

import type {MenuGroup} from '../../../types';
import {createBlock} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import {AsideHeaderItem} from '../../types';
import {buildCompositeBarRows} from '../CompositeBar/grouping';

import {AllPagesListItem} from './AllPagesListItem';
import {
    ALL_PAGES_PANEL_ROW_BUILD_OPTIONS,
    getAllPagesEditModeFlatItems,
    getCompositeBarHeaderGroupId,
    reorderMenuItemsByCompositeBarRows,
    rowsToAllPagesDisplayItems,
} from './allPagesEditDisplay';
import {isAllPagesSortableItem, reorderAllPagesSortableItems} from './allPagesSortable';
import {ALL_PAGES_ID} from './constants';
import i18n from './i18n';
import {useGroupedMenuItems} from './useGroupedMenuItems';

import styles from './AllPagesPanel.module.scss';

const b = createBlock('all-pages-panel', styles);

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
        onMenuGroupsChanged,
    } = useAsideHeaderInnerContext();

    const menuItemsRef = useRef(menuItems);
    menuItemsRef.current = menuItems;

    const [isEditMode, setIsEditMode] = useState(false);

    const [draggingItemTitle, setDraggingItemTitle] = useState<ReactNode | null>(null);

    const toggleEditMode = useCallback(() => {
        setIsEditMode((prev) => !prev);
    }, []);

    const groupedItems = useGroupedMenuItems(
        menuItems,
        isEditMode,
        menuGroups,
        onMenuGroupsChanged,
    );

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
            const groupIdFromHeader = getCompositeBarHeaderGroupId(item.id);
            if (groupIdFromHeader && menuGroups && onMenuGroupsChanged) {
                const previousGroup = menuGroups.find((g) => g.id === groupIdFromHeader);
                if (!previousGroup) {
                    return;
                }
                const changedGroup: MenuGroup = {
                    ...previousGroup,
                    hidden: !previousGroup.hidden,
                };
                editMenuProps?.onToggleMenuGroup?.(changedGroup);
                onMenuGroupsChanged(
                    menuGroups.map((g) => (g.id === groupIdFromHeader ? changedGroup : g)),
                );
                return;
            }

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
        [onMenuItemsChanged, editMenuProps, menuGroups, onMenuGroupsChanged],
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
    }, [onMenuItemsChanged, editMenuProps, defaultMenuItems]);

    const changeItemsOrder = useCallback(
        ({oldIndex, newIndex}: {oldIndex: number; newIndex: number}) => {
            const withoutAllPages = menuItemsRef.current.filter(
                ({id, type}) => id !== ALL_PAGES_ID && type !== 'divider',
            );

            let element: AsideHeaderItem | undefined;
            let reordered: AsideHeaderItem[];

            if (menuGroups?.length) {
                const rows = buildCompositeBarRows(
                    withoutAllPages,
                    menuGroups,
                    ALL_PAGES_PANEL_ROW_BUILD_OPTIONS,
                );
                const display = rowsToAllPagesDisplayItems(rows, {
                    enableGroupHeaderPins: Boolean(onMenuGroupsChanged),
                });
                element = display[oldIndex];
                reordered = reorderMenuItemsByCompositeBarRows(
                    withoutAllPages,
                    menuGroups,
                    oldIndex,
                    newIndex,
                );
            } else {
                const sortableBefore = withoutAllPages.filter(isAllPagesSortableItem);
                element = sortableBefore[oldIndex];
                reordered = reorderAllPagesSortableItems(withoutAllPages, oldIndex, newIndex);
            }

            onMenuItemsChanged?.(reordered);

            setDraggingItemTitle(null);
            if (element) {
                editMenuProps?.onChangeItemsOrder?.(element, oldIndex, newIndex);
            }
        },
        [onMenuItemsChanged, editMenuProps, menuGroups, onMenuGroupsChanged],
    );

    const sortableItems = useMemo(() => {
        const without = menuItems.filter(({id, type}) => id !== ALL_PAGES_ID && type !== 'divider');
        const pinHeaders = Boolean(onMenuGroupsChanged);
        if (menuGroups?.length) {
            return getAllPagesEditModeFlatItems(without, menuGroups, {
                enableGroupHeaderPins: pinHeaders,
            });
        }
        return without.filter(isAllPagesSortableItem);
    }, [menuItems, menuGroups, onMenuGroupsChanged]);

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
            <Flex className={b('content', {editMode: isEditMode})} gap="5" direction="column">
                {isEditMode && editMenuProps?.enableSorting ? (
                    <div>
                        <List
                            itemClassName={b('item', {editMode: true})}
                            itemHeight={40}
                            onSortEnd={changeItemsOrder}
                            sortable
                            virtualized={false}
                            filterable={false}
                            items={sortableItems}
                            onItemClick={onItemClick}
                            renderItem={itemRender}
                        />

                        {draggingItemTitle && (
                            <div className={b('drag-placeholder')}>{draggingItemTitle}</div>
                        )}
                    </div>
                ) : (
                    Object.keys(groupedItems).map((category) => {
                        return (
                            <Flex key={category} direction="column" gap="3">
                                <Text className={b('category')} variant="body-1" color="secondary">
                                    {category}
                                </Text>
                                <List
                                    virtualized={false}
                                    filterable={false}
                                    items={groupedItems[category]}
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
