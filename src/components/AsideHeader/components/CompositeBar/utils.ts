import {ITEM_HEIGHT} from '../../../constants';
import {AsideHeaderItem} from '../../types';
import {MenuItemsWithGroups} from '../AllPagesPanel/useGroupedMenuItems';

function getGroupHeight(compositeItem: MenuItemsWithGroups) {
    const visibleItemsCount = compositeItem.items?.filter(({hidden}) => !hidden).length || 0;

    const visibleGroupItemsCount = compositeItem.isCollapsed ? 0 : visibleItemsCount;

    return ITEM_HEIGHT * (visibleGroupItemsCount + 1);
}

export function getItemHeight(compositeItem: MenuItemsWithGroups) {
    if (compositeItem.items && compositeItem.items?.length > 0) {
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

export function sortItemsByAfterMoreButton(compositeItems: AsideHeaderItem[]): AsideHeaderItem[] {
    const afterMoreButtonItems = compositeItems.filter(({afterMoreButton}) => afterMoreButton);
    const regularItems = compositeItems.filter(({afterMoreButton}) => !afterMoreButton);

    return [...regularItems, ...afterMoreButtonItems];
}
