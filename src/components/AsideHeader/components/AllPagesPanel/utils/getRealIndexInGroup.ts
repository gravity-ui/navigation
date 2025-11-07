import {MenuItemsWithGroups} from '../../../types';

function getRealIndexInExpandedMenu(
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

export function getRealIndexInGroup(
    groupIndex: number,
    itemIndexInGroup: number,
    flatList: MenuItemsWithGroups[],
): number {
    const groupStartIndex = getRealIndexInExpandedMenu(groupIndex, flatList);

    return groupStartIndex + itemIndexInGroup;
}
