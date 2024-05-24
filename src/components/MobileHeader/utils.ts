import {MOBILE_ITEM_HEIGHT} from './constants';
import {MobileHeaderEventOptions, MobileMenuItem} from './types';

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

export const getMobileHeaderCustomEvent = (
    eventName: string,
    detail?: MobileHeaderEventOptions,
) => {
    return new CustomEvent<MobileHeaderEventOptions>(eventName, {detail});
};
