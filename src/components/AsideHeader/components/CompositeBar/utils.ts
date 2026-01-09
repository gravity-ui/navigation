import {ITEM_GAP, ITEM_HEIGHT, ITEM_HEIGHT_COMPACT} from '../../../constants';
import {AsideHeaderItem, GroupedMenuItem, MenuItemsWithGroups} from '../../types';
import {getGroupBlockHeight} from '../../utils/getGroupHeight';

function getGroupHeight(compositeItem: GroupedMenuItem, isCompactMode?: boolean) {
    const visibleGroupItems = compositeItem.isCollapsed ? [] : compositeItem.items;

    return getGroupBlockHeight(visibleGroupItems, isCompactMode);
}

export function getItemHeight(compositeItem: MenuItemsWithGroups, isCompactMode?: boolean) {
    if ('items' in compositeItem && compositeItem.items && compositeItem.items?.length > 0) {
        return getGroupHeight(compositeItem, isCompactMode);
    }

    switch (compositeItem.type) {
        case 'action':
            return 50;
        case 'divider':
            return 15;

        default:
            return isCompactMode ? ITEM_HEIGHT_COMPACT : ITEM_HEIGHT;
    }
}

export function getItemsHeight<T extends AsideHeaderItem>(items: T[], isCompactMode?: boolean) {
    const gaps = (items.length - 1) * ITEM_GAP;

    return items.reduce((sum, item) => sum + getItemHeight(item, isCompactMode), 0) + gaps;
}

export function getSelectedItemIndex(compositeItems: AsideHeaderItem[]) {
    const index = compositeItems.findIndex(({current}) => Boolean(current));
    return index === -1 ? undefined : index;
}
