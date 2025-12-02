import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {Gear} from '@gravity-ui/icons';
import {Button, Flex, Icon, ListSortParams, Text, Tooltip} from '@gravity-ui/uikit';

import {block} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import {AsideHeaderItem, MenuItemsWithGroups} from '../../types';
import {CompositeBarView} from '../CompositeBar/CompositeBar';

import {ALL_PAGES_ID} from './constants';
import i18n from './i18n';
import {useGroupedMenuItems} from './useGroupedMenuItems';
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

    const [isEditMode, setIsEditMode] = useState(false);

    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};

        items.forEach((item) => {
            if ('groupId' in item && item.groupId && 'isCollapsed' in item) {
                initial[item.groupId] = false;
            }
        });
        return initial;
    });

    const handleToggleGroupCollapsed = useCallback((groupId: string) => {
        setCollapsedGroups((prev) => ({...prev, [groupId]: !prev[groupId]}));
    }, []);

    const toggleEditMode = useCallback(() => {
        setIsEditMode((prev) => !prev);
    }, []);

    useEffect(() => {
        onEditModeChanged?.(isEditMode);

        if (isEditMode) {
            editMenuProps?.onOpenEditMode?.();
        }
    }, [isEditMode, onEditModeChanged, editMenuProps]);

    const onItemClick = useCallback(
        (
            item: AsideHeaderItem,
            collapsed: boolean,
            event: React.MouseEvent<HTMLElement, MouseEvent>,
        ) => {
            // TODO: make event an optional argument
            item.onItemClick?.(item, collapsed, event as React.MouseEvent<HTMLElement, MouseEvent>);
        },
        [],
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

    const handleToggleGroupVisibility = useCallback(
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

    const toggleMenuItemsVisibility = useCallback(
        (item: MenuItemsWithGroups) => {
            if (!onMenuItemsChanged) {
                return;
            }

            const changedItem: MenuItemsWithGroups = {
                ...item,
                hidden: !item.hidden,
            };

            const originItems = menuItemsRef.current;
            const expandedItems = buildExpandedFromFlatList(originItems);

            editMenuProps?.onToggleMenuItem?.(changedItem);

            onMenuItemsChanged(
                expandedItems.map((menuItem) => {
                    if (menuItem.id !== changedItem.id) {
                        return menuItem;
                    }
                    return changedItem;
                }),
            );
        },
        [onMenuItemsChanged, editMenuProps],
    );

    const onFirstLevelSortEnd = useCallback(
        ({oldIndex, newIndex}: ListSortParams) => {
            if (!onMenuItemsChanged) {
                return;
            }

            const currentFlatList = menuItemsRef.current || [];
            const updatedItems = sortMenuItems(oldIndex, newIndex, currentFlatList);

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

    const itemsWithLocalCollapsed = useMemo(() => {
        return items.map((item) => {
            if ('groupId' in item && item.groupId && item.groupId in collapsedGroups) {
                return {
                    ...item,
                    isCollapsed: collapsedGroups[item.groupId],
                };
            }
            return item;
        });
    }, [items, collapsedGroups]);

    const data = itemsWithLocalCollapsed.filter(
        (item) => item.id !== ALL_PAGES_ID && item.type !== 'action',
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

            <CompositeBarView
                type="menu"
                compact={false}
                className={b('content')}
                enableSorting={isEditMode && editMenuProps?.enableSorting}
                items={data}
                onFirstLevelSortEnd={
                    isEditMode && editMenuProps?.enableSorting ? onFirstLevelSortEnd : undefined
                }
                onSecondLevelSortEnd={
                    isEditMode && editMenuProps?.enableSorting ? onSecondLevelSortEnd : undefined
                }
                editMode={isEditMode}
                onItemClick={onItemClick}
                onToggleGroupCollapsed={handleToggleGroupCollapsed}
                onToggleMenuGroupVisibility={handleToggleGroupVisibility}
                onToggleMenuItemVisibility={toggleMenuItemsVisibility}
            />
            {isEditMode && (
                <Button onClick={onResetToDefaultClick}>{i18n('all-panel.resetToDefault')}</Button>
            )}
        </Flex>
    );
};
