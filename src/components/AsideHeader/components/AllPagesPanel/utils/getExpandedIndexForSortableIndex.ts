import {MenuItemsWithGroups} from '../../../types';

import {getIsMenuItem} from './getIsMenuItem';
import {getRealIndexInExpandedMenu} from './getRealIndexInGroup';

/**
 * Returns index in expanded list for the sortableIndex-th sortable item in flatList.
 *
 * @param sortableIndex - Index in the list of sortable (non-divider) items.
 * @param flatList - Flat list with groups and dividers.
 * @returns Index in the expanded (flattened) menu list.
 */
export function getExpandedIndexForSortableIndex(
    sortableIndex: number,
    flatList: MenuItemsWithGroups[],
): number {
    let sortableCount = 0;
    for (let i = 0; i < flatList.length; i++) {
        if (getIsMenuItem(flatList[i])) {
            if (sortableCount === sortableIndex) {
                return getRealIndexInExpandedMenu(i, flatList);
            }
            sortableCount++;
        }
    }
    return 0;
}
