import {ITEM_HEIGHT} from '../../../constants';
import {AsideHeaderItem} from '../../types';

export function getItemHeight(compositeItem: AsideHeaderItem) {
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
