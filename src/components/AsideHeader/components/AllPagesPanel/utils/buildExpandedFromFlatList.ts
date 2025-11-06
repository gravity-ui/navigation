import {MenuItem} from 'src/components/types';

import {MenuItemsWithGroups} from '../useGroupedMenuItems';

export function buildExpandedFromFlatList(flatList: MenuItemsWithGroups[]): MenuItem[] {
    const expanded: MenuItem[] = [];

    flatList.forEach((item) => {
        if (item.items && item.items.length > 0) {
            expanded.push(...item.items);
        } else {
            expanded.push(item);
        }
    });

    return expanded;
}
