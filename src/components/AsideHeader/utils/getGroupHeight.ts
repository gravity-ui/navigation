import {ITEM_HEIGHT} from '../../constants';
import {MenuItemsWithGroups} from '../types';

const GAP = 2;

export function getGroupBlockHeight(items: MenuItemsWithGroups[]) {
    if (items.length === 0) {
        return ITEM_HEIGHT;
    }

    const gaps = items.length * GAP;

    return (items.length + 1) * ITEM_HEIGHT + gaps;
}
