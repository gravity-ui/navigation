import {useMemo} from 'react';

import {MenuGroup, MenuItem} from '../../types';
import {useAsideHeaderInnerContext} from '../AsideHeaderContext';

export interface GroupedMenuItem extends MenuItem {
    groupId?: string;
}

export interface MenuGroupWithItems extends MenuGroup {
    items: GroupedMenuItem[];
}

export const useGroupedMenuItems = (): MenuGroupWithItems[] => {
    const {menuItems, menuGroups} = useAsideHeaderInnerContext();

    return useMemo(() => {
        if (!menuItems || !menuGroups) {
            return [];
        }

        const visibleItems = menuItems.filter((item: MenuItem): boolean => {
            if (item.hidden) {
                return false;
            }

            if (item.type === 'divider') {
                return false;
            }

            return true;
        });

        const groupedItems = new Map<string, GroupedMenuItem[]>();
        const ungroupedItems: GroupedMenuItem[] = [];

        visibleItems.forEach((item) => {
            const groupId = item.groupId;

            if (groupId) {
                if (!groupedItems.has(groupId)) {
                    groupedItems.set(groupId, []);
                }

                const group = groupedItems.get(groupId);

                if (group) {
                    group.push(item as GroupedMenuItem);
                }
            } else {
                ungroupedItems.push(item as GroupedMenuItem);
            }
        });

        const groupsWithItems: MenuGroupWithItems[] = [];

        menuGroups
            .filter((group) => group.visible !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .forEach((group) => {
                const items = groupedItems.get(group.id) || [];
                if (items.length > 0) {
                    groupsWithItems.push({
                        ...group,
                        items: items.sort((a, b) => (a.order || 0) - (b.order || 0)),
                    });
                }
            });

        if (ungroupedItems.length > 0) {
            groupsWithItems.push({
                id: 'ungrouped',
                title: '',
                items: ungroupedItems.sort((a, b) => (a.order || 0) - (b.order || 0)),
            });
        }

        return groupsWithItems;
    }, [menuItems, menuGroups]);
};
