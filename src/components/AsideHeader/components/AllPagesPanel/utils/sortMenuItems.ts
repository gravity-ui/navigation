import {MenuItemsWithGroups} from '../useGroupedMenuItems';

import {buildExpandedFromFlatList} from './buildExpandedFromFlatList';

export function sortMenuItems(oldIndex: number, newIndex: number, items: MenuItemsWithGroups[]) {
    const sortedItems = [...items];

    [sortedItems[oldIndex], sortedItems[newIndex]] = [sortedItems[newIndex], sortedItems[oldIndex]];

    const expandedItems = buildExpandedFromFlatList(sortedItems);
    const updatedItems = expandedItems.map((item, index) => ({
        ...item,
        order: index,
    }));

    return updatedItems.filter(({type}) => type !== 'divider');
}
