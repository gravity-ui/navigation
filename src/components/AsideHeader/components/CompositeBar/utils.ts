import {ITEM_HEIGHT} from '../../../constants';
import {AsideHeaderItem, GroupedMenuItem, MenuItemsWithGroups} from '../../types';
import {getGroupBlockHeight} from '../../utils/getGroupHeight';

function getGroupHeight(compositeItem: GroupedMenuItem) {
    const visibleGroupItems = compositeItem.isCollapsed ? [] : compositeItem.items;

    return getGroupBlockHeight(visibleGroupItems);
}

export function getItemHeight(compositeItem: MenuItemsWithGroups) {
    if ('items' in compositeItem && compositeItem.items && compositeItem.items?.length > 0) {
        return getGroupHeight(compositeItem);
    }

    switch (compositeItem.type) {
        case 'action':
            return 50;
        case 'divider':
            return 15;

        default:
            return ITEM_HEIGHT;
    }
}

export function getItemsHeight<T extends AsideHeaderItem>(items: T[]) {
    return items.reduce((sum, item) => sum + getItemHeight(item), 0);
}

export function getSelectedItemIndex(compositeItems: AsideHeaderItem[]) {
    const index = compositeItems.findIndex(({current}) => Boolean(current));
    return index === -1 ? undefined : index;
}
