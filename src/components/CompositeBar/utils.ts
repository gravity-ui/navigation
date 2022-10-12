import {MenuItem} from './../types';
import {ITEM_HEIGHT} from './constants';

export function getItemHeight(item: MenuItem) {
    switch (item.type) {
        case 'action':
            return 50;
        case 'divider':
            return 15;

        default:
            return ITEM_HEIGHT;
    }
}

export function getItemsHeight(items: MenuItem[]) {
    return items.reduce((sum, item) => sum + getItemHeight(item), 0);
}

export function getSelectedItemIndex(items: MenuItem[]) {
    const index = items.findIndex(({current}) => Boolean(current));
    return index === -1 ? undefined : index;
}

export function getPinnedItems(items: MenuItem[]) {
    const pinnedItems: MenuItem[] = [];
    for (const item of items) {
        if (item.pinned) {
            pinnedItems.push(item);
        } else if (item.type === 'divider') {
            if (pinnedItems.length > 0 && pinnedItems[pinnedItems.length - 1].type !== 'divider') {
                pinnedItems.push(item);
            }
        }
    }
    return pinnedItems;
}

export function getItemsMinHeight(items: MenuItem[]) {
    const pinnedItems = getPinnedItems(items);
    const afterMoreButtonItems = items.filter((item) => item.afterMoreButton);

    return (
        getItemsHeight(pinnedItems) +
        getItemsHeight(afterMoreButtonItems) +
        (pinnedItems.length === items.length ? 0 : ITEM_HEIGHT)
    );
}
