import {MenuItemsWithGroups} from '../../../types';

import {getIsMenuItem} from './getIsMenuItem';

/** Sorts menu items while preserving divider positions at their original locations. */
export function sortMenuItemsWithDividers(
    oldIndex: number,
    newIndex: number,
    currentFlatList: MenuItemsWithGroups[],
): MenuItemsWithGroups[] {
    // Single pass: collect dividers and items
    const dividerPositions: Array<{index: number; item: MenuItemsWithGroups}> = [];
    const itemsWithoutDividers: MenuItemsWithGroups[] = [];

    currentFlatList.forEach((item, index) => {
        if (item.type === 'divider') {
            dividerPositions.push({index, item});
        } else if (getIsMenuItem(item)) {
            itemsWithoutDividers.push(item);
        }
    });

    if (
        itemsWithoutDividers[oldIndex] === undefined ||
        itemsWithoutDividers[newIndex] === undefined
    ) {
        return currentFlatList;
    }

    const sortedItemsWithoutDividers = [...itemsWithoutDividers];
    const [movedElement] = sortedItemsWithoutDividers.splice(oldIndex, 1);
    sortedItemsWithoutDividers.splice(newIndex, 0, movedElement);

    // Insert dividers back at their original positions in currentFlatList
    const result: MenuItemsWithGroups[] = [];
    const dividerMap = new Map(dividerPositions.map((d) => [d.index, d.item]));
    let sortedIndex = 0;

    for (let originalIndex = 0; originalIndex < currentFlatList.length; originalIndex++) {
        const dividerItem = dividerMap.get(originalIndex);

        if (dividerItem) {
            // Insert divider at its original position
            result.push(dividerItem);
        } else if (sortedIndex < sortedItemsWithoutDividers.length) {
            // Insert item from sorted array (without dividers)
            result.push(sortedItemsWithoutDividers[sortedIndex++]);
        }
    }

    return result;
}
