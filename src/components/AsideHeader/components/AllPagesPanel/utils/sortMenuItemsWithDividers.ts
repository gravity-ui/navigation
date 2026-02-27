import {MenuItemsWithGroups} from '../../../types';

import {getIsMenuItem} from './getIsMenuItem';

/** Items that stay at their position when sorting (not draggable). */
function isFixedPositionItem(item: MenuItemsWithGroups): boolean {
    return item.type === 'divider' || item.type === 'action';
}

/**
 * Sorts menu items while preserving divider and action positions at their original locations.
 */
export function sortMenuItemsWithDividers(
    oldIndex: number,
    newIndex: number,
    currentFlatList: MenuItemsWithGroups[],
): MenuItemsWithGroups[] {
    const fixedPositionItems: Array<{index: number; item: MenuItemsWithGroups}> = [];
    const sortableItems: MenuItemsWithGroups[] = [];

    currentFlatList.forEach((item, index) => {
        if (isFixedPositionItem(item)) {
            fixedPositionItems.push({index, item});
        } else if (getIsMenuItem(item)) {
            sortableItems.push(item);
        }
    });

    if (sortableItems[oldIndex] === undefined || sortableItems[newIndex] === undefined) {
        return currentFlatList;
    }

    const sortedItems = [...sortableItems];
    const [movedElement] = sortedItems.splice(oldIndex, 1);
    sortedItems.splice(newIndex, 0, movedElement);

    const result: MenuItemsWithGroups[] = [];
    const fixedMap = new Map(fixedPositionItems.map((f) => [f.index, f.item]));
    let sortableIndex = 0;

    for (let originalIndex = 0; originalIndex < currentFlatList.length; originalIndex++) {
        const fixedItem = fixedMap.get(originalIndex);

        if (fixedItem) {
            result.push(fixedItem);
        } else if (sortableIndex < sortedItems.length) {
            result.push(sortedItems[sortableIndex++]);
        }
    }

    return result;
}
