import {ITEM_HEIGHT} from '../../constants';
import {MenuItemsWithGroups} from '../types';

const GAP = 2;

export function getGroupBlockHeight(items: MenuItemsWithGroups[]) {
    if (items.length === 0) {
        return ITEM_HEIGHT;
    }

    const gaps = items.length * GAP;

    // +1 accounts for the group header item in addition to the menu items
    return (items.length + 1) * ITEM_HEIGHT + gaps;
}
