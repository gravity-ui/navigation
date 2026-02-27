import {MenuItemsWithGroups} from '../../../types';

import {buildExpandedFromFlatList} from './buildExpandedFromFlatList';
import {getIsMenuItem} from './getIsMenuItem';
import {sortMenuItemsWithDividers} from './sortMenuItemsWithDividers';

/**
 * Returns index in flatList of the sortableIndex-th sortable item (getIsMenuItem).
 * Used when groupIndex from the List is the index in the filtered list without dividers.
 *
 * @param sortableIndex - Index in the list of sortable (non-divider) items.
 * @param flatList - Flat list with groups and dividers.
 * @returns Index in flatList of the sortableIndex-th sortable item.
 */
export function getFlatListIndexForSortableIndex(
    sortableIndex: number,
    flatList: MenuItemsWithGroups[],
): number {
    let sortableCount = 0;
    for (let i = 0; i < flatList.length; i++) {
        if (getIsMenuItem(flatList[i])) {
            if (sortableCount === sortableIndex) {
                return i;
            }
            sortableCount++;
        }
    }
    return 0;
}

/**
 * Returns index in groupItems array for the sortableIndex-th sortable (non-divider) item.
 * Used when oldIndex/newIndex from sort are indices in the sortable-only list.
 *
 * @param sortableIndex - Index in the list of sortable (non-divider) items.
 * @param groupItems - Items of the group (may contain dividers).
 * @returns Index in groupItems of the sortableIndex-th sortable item.
 */
export function getIndexInGroupItemsForSortableIndex(
    sortableIndex: number,
    groupItems: MenuItemsWithGroups[],
): number {
    let sortableCount = 0;
    for (let i = 0; i < groupItems.length; i++) {
        if (getIsMenuItem(groupItems[i])) {
            if (sortableCount === sortableIndex) {
                return i;
            }
            sortableCount++;
        }
    }
    return 0;
}

export function getRealIndexInExpandedMenu(
    flatListIndex: number,
    flatList: MenuItemsWithGroups[],
): number {
    let realIndex = 0;

    for (let i = 0; i < flatListIndex; i++) {
        const item = flatList[i];

        if ('items' in item && item.items && item.items.length > 0) {
            realIndex += item.items.length;
        } else {
            realIndex += 1;
        }
    }

    return realIndex;
}

/**
 * Returns index in the expanded menu for an item in a group.
 * itemIndexInGroup is the index in the sortable-only list (dividers are not counted).
 *
 * @param groupIndex - Index of the group in the flat list.
 * @param itemIndexInGroup - Index in the sortable-only list within the group.
 * @param flatList - Flat list with groups and dividers.
 * @returns Index in the expanded (flattened) menu list.
 */
export function getRealIndexInGroup(
    groupIndex: number,
    itemIndexInGroup: number,
    flatList: MenuItemsWithGroups[],
): number {
    const groupStartIndex = getRealIndexInExpandedMenu(groupIndex, flatList);
    const groupItem = flatList[groupIndex];

    if ('items' in groupItem && groupItem.items && groupItem.items.length > 0) {
        const positionInGroup = getIndexInGroupItemsForSortableIndex(
            itemIndexInGroup,
            groupItem.items,
        );
        return groupStartIndex + positionInGroup;
    }

    return groupStartIndex + itemIndexInGroup;
}

type GroupWithItems = MenuItemsWithGroups & {items: MenuItemsWithGroups[]};

/**
 * Returns group item and its index in flat list by sortable index (index in list without dividers).
 *
 * @param sortableIndex - Index in the filtered list (getIsMenuItem).
 * @param flatList - Flat list with groups and dividers.
 * @returns Object with flatListGroupIndex and groupItem, or null if not a group with items.
 */
export function getGroupAtSortableIndex(
    sortableIndex: number,
    flatList: MenuItemsWithGroups[],
): {flatListGroupIndex: number; groupItem: GroupWithItems} | null {
    const flatListGroupIndex = getFlatListIndexForSortableIndex(sortableIndex, flatList);
    const groupItem = flatList[flatListGroupIndex];

    if (!groupItem || !('items' in groupItem) || !(groupItem as GroupWithItems).items?.length) {
        return null;
    }

    return {flatListGroupIndex, groupItem: groupItem as GroupWithItems};
}

/**
 * Returns new flat list with group items replaced at the given index.
 *
 * @param flatList - Current flat list.
 * @param flatListGroupIndex - Index of the group in flat list.
 * @param newGroupItems - New items array for the group.
 * @returns New flat list with updated group.
 */
export function updateGroupItemsInFlatList(
    flatList: MenuItemsWithGroups[],
    flatListGroupIndex: number,
    newGroupItems: MenuItemsWithGroups[],
): MenuItemsWithGroups[] {
    return flatList.map((item, i) =>
        i === flatListGroupIndex && 'items' in item ? {...item, items: newGroupItems} : item,
    );
}

interface SecondLevelSortResult {
    newFlatList: MenuItemsWithGroups[];
    expandedItems: ReturnType<typeof buildExpandedFromFlatList>;
    realOldIndex: number;
    realNewIndex: number;
    changedItem: ReturnType<typeof buildExpandedFromFlatList>[number] | undefined;
}

/**
 * Applies second-level sort (within a group) and returns new flat list, expanded items and indices.
 * Keeps dividers in place inside the group.
 *
 * @param groupIndex - Sortable index of the group (from List, without dividers).
 * @param oldIndex - Sortable index of dragged item in the group.
 * @param newIndex - Sortable index of drop position in the group.
 * @param currentFlatList - Current flat list.
 * @returns Result with newFlatList, expandedItems, indices and changedItem, or null if invalid.
 */
export function applySecondLevelSort(
    groupIndex: number,
    oldIndex: number,
    newIndex: number,
    currentFlatList: MenuItemsWithGroups[],
): SecondLevelSortResult | null {
    const groupData = getGroupAtSortableIndex(groupIndex, currentFlatList);

    if (!groupData) {
        return null;
    }

    const {flatListGroupIndex, groupItem} = groupData;
    const sortedGroupItems = sortMenuItemsWithDividers(oldIndex, newIndex, groupItem.items);
    const newFlatList = updateGroupItemsInFlatList(
        currentFlatList,
        flatListGroupIndex,
        sortedGroupItems,
    );
    const expandedItems = buildExpandedFromFlatList(newFlatList);
    const expandedItemsOld = buildExpandedFromFlatList(currentFlatList);
    const realOldIndex = getRealIndexInGroup(flatListGroupIndex, oldIndex, currentFlatList);
    const realNewIndex = getRealIndexInGroup(flatListGroupIndex, newIndex, newFlatList);
    const changedItem = expandedItemsOld[realOldIndex];

    return {
        newFlatList,
        expandedItems,
        realOldIndex,
        realNewIndex,
        changedItem,
    };
}
