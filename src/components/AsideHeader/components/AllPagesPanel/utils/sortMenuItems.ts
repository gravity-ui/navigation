import {MenuItemsWithGroups} from '../../../types';

import {buildExpandedFromFlatList} from './buildExpandedFromFlatList';

export function sortMenuItems(oldIndex: number, newIndex: number, items: MenuItemsWithGroups[]) {
    const sortedItems = [...items];

    const [movedElement] = sortedItems.splice(oldIndex, 1);

    sortedItems.splice(newIndex, 0, movedElement);

    const expandedItems = buildExpandedFromFlatList(sortedItems);
    const updatedItems = expandedItems.map((item, index) => ({
        ...item,
        order: index,
    }));

    return updatedItems.filter(({type}) => type !== 'divider');
}
