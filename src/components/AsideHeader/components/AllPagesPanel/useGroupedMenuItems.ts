import {useMemo} from 'react';

import {MenuGroup, MenuItem} from '../../../types';
import {MenuItemsWithGroups} from '../../types';

import {ALL_PAGES_ID} from '.';

export const useGroupedMenuItems = (
    menuItems: MenuItem[],
    menuGroups?: MenuGroup[],
    isEditMode = false,
): MenuItemsWithGroups[] => {
    return useMemo(() => {
        const visibleItems = menuItems.filter((item: MenuItem): boolean => {
            if (item.type === 'divider') {
                return false;
            }

            if (isEditMode && item.id === ALL_PAGES_ID) {
                return false;
            }

            return true;
        });

        visibleItems.sort(({type: typeA}, {type: typeB}) => {
            if (typeA === 'action') {
                return 1;
            }
            if (typeB === 'action') {
                return -1;
            }
            return 0;
        });

        const groupsMap = new Map<string, MenuGroup>();

        menuGroups?.forEach((group) => {
            groupsMap.set(group.id, group);
        });

        const groupedItems = new Map<string, MenuItemsWithGroups[]>();
        const ungroupedItems: MenuItemsWithGroups[] = [];
        const processedGroups = new Set<string>();

        visibleItems.forEach((item) => {
            const groupId = item.groupId;

            if (groupId) {
                if (!groupedItems.has(groupId)) {
                    groupedItems.set(groupId, []);
                }

                const group = groupedItems.get(groupId);

                if (group) {
                    group.push(item);
                }
            } else {
                ungroupedItems.push(item);
            }
        });

        const flatListItems: MenuItemsWithGroups[] = [];

        visibleItems.forEach((item) => {
            const groupId = item.groupId;

            if (groupId) {
                if (!processedGroups.has(groupId)) {
                    processedGroups.add(groupId);

                    const items = groupedItems.get(groupId) || [];

                    if (items.length > 0) {
                        const sortedItems = items.sort((a, b) => (a.order || 0) - (b.order || 0));
                        const itemsWithVisible = sortedItems.filter(
                            (sortedItem) => !sortedItem.hidden,
                        );

                        const group = groupsMap.get(groupId);
                        const isAllGroupItemsHidden = itemsWithVisible.length === 0;
                        const isGroupHidden = isAllGroupItemsHidden
                            ? true
                            : (group?.hidden ?? false);

                        flatListItems.push({
                            id: groupId,
                            title: group?.title ?? groupId,
                            icon: group?.icon,
                            order: group?.order ?? sortedItems[0]?.order ?? 0,
                            hidden: isGroupHidden,
                            isDisabled: isAllGroupItemsHidden,
                            collapsible: group?.collapsible,
                            collapsedByDefault: group?.collapsedByDefault,
                            isCollapsed: group?.collapsed,
                            groupId: groupId,
                            items: sortedItems,
                        });
                    }
                }
            }

            if (!groupId) {
                flatListItems.push(item);
            }
        });

        return flatListItems;
    }, [menuItems, menuGroups, isEditMode]);
};
