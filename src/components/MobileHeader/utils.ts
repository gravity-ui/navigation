import {MobileMenuItem} from '../types';
import {MOBILE_ITEM_HEIGHT} from './constants';

export const getItemHeight = (item: MobileMenuItem) => {
    switch (item.type) {
        case 'divider':
            return 1;
        default:
            return MOBILE_ITEM_HEIGHT;
    }
};

export const getSelectedItemIndex = (items: MobileMenuItem[]) => {
    const index = items.findIndex(({current}) => Boolean(current));

    return index === -1 ? undefined : index;
};
