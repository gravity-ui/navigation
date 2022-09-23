import {MenuItem} from './../types';
import {ITEM_HEIGHT} from './constants';

export function getItemHeight(item: MenuItem) {
    switch (item.type) {
        case 'action':
            return 50;

        default:
            return ITEM_HEIGHT;
    }
}

export function getItemsHeight(items: MenuItem[]) {
    return items.reduce((sum, item) => sum + getItemHeight(item), 0);
}

export const getSelectedItemIndex = (items: MenuItem[]) => {
    const index = items.findIndex(({current}) => Boolean(current));
    return index === -1 ? undefined : index;
};
