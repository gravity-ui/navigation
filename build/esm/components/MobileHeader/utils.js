import { MOBILE_ITEM_HEIGHT } from './constants.js';

const getItemHeight = (item) => {
    switch (item.type) {
        case 'divider':
            return 1;
        default:
            return MOBILE_ITEM_HEIGHT;
    }
};
const getSelectedItemIndex = (items) => {
    const index = items.findIndex(({ current }) => Boolean(current));
    return index === -1 ? undefined : index;
};
const getMobileHeaderCustomEvent = (eventName, detail) => {
    return new CustomEvent(eventName, { detail });
};

export { getItemHeight, getMobileHeaderCustomEvent, getSelectedItemIndex };
//# sourceMappingURL=utils.js.map
