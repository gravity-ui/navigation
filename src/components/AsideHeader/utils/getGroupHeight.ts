import {ITEM_HEIGHT, ITEM_HEIGHT_COMPACT} from '../../constants';
import {MenuItemsWithGroups} from '../types';

const GAP = 2;

export function getGroupBlockHeight(items: MenuItemsWithGroups[], isCompactMode?: boolean) {
    const itemHeight = isCompactMode ? ITEM_HEIGHT_COMPACT : ITEM_HEIGHT;

    if (items.length === 0) {
        return itemHeight;
    }

    const gaps = items.length * GAP;

    // +1 accounts for the group header item in addition to the menu items
    return (items.length + 1) * itemHeight + gaps;
}
