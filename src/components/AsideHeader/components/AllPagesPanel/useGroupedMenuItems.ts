import {useMemo} from 'react';

import {MenuGroup, MenuItem} from '../../../types';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';

import {UNGROUPED_ID} from './constants';
import i18n from './i18n';

import {ALL_PAGES_ID} from '.';

export interface GroupedMenuItem extends MenuItem {
    groupId?: string;
}

export interface MenuGroupWithItems extends MenuGroup {
    items: GroupedMenuItem[];
}

export const useGroupedMenuItems = (isAllPagesAvailable = true): MenuGroupWithItems[] => {
    const {menuItems, menuGroups} = useAsideHeaderInnerContext();

    return useMemo(() => {
        const visibleItems = menuItems.filter((item: MenuItem): boolean => {
            if (item.type === 'divider') {
                return false;
            }

            if (!isAllPagesAvailable && item.id === ALL_PAGES_ID) {
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
                    group.push(item);
                }
            } else {
                ungroupedItems.push(item);
            }
        });

        const groupsWithItems: MenuGroupWithItems[] = [];

        menuGroups
            ?.sort((a, b) => (a.order || 0) - (b.order || 0))
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
                id: UNGROUPED_ID,
                title: i18n('all-panel.menu.category.allOther'),
                items: ungroupedItems.sort((a, b) => (a.order || 0) - (b.order || 0)),
            });
        }

        return groupsWithItems;
    }, [menuItems, menuGroups, isAllPagesAvailable]);
};
