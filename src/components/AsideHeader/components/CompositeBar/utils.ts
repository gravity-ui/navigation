import {Ellipsis} from '@gravity-ui/icons';

import {ITEM_HEIGHT} from '../../../constants';
import {AsideHeaderItem} from '../../types';

import {COLLAPSE_ITEM_ID} from './constants';

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

function getPinnedItems(compositeItems: AsideHeaderItem[]) {
    const pinnedItems: AsideHeaderItem[] = [];
    for (const compositeItem of compositeItems) {
        if (compositeItem.pinned) {
            pinnedItems.push(compositeItem);
        } else if (compositeItem.type === 'divider') {
            if (pinnedItems.length > 0 && pinnedItems[pinnedItems.length - 1].type !== 'divider') {
                pinnedItems.push(compositeItem);
            }
        }
    }
    return pinnedItems;
}

export function getItemsMinHeight(compositeItems: AsideHeaderItem[]) {
    const pinnedItems = getPinnedItems(compositeItems);
    const afterMoreButtonItems = compositeItems.filter(({afterMoreButton}) => afterMoreButton);

    return (
        getItemsHeight(pinnedItems) +
        getItemsHeight(afterMoreButtonItems) +
        (pinnedItems.length === compositeItems.length ? 0 : ITEM_HEIGHT)
    );
}

export function getMoreButtonItem(menuMoreTitle?: string): AsideHeaderItem {
    return {
        id: COLLAPSE_ITEM_ID,
        title: menuMoreTitle,
        icon: Ellipsis,
        iconSize: 18,
    };
}

export function getAutosizeListItems(
    compositeItems: AsideHeaderItem[],
    height: number,
    collapseItem: AsideHeaderItem,
): {
    listItems: AsideHeaderItem[];
    collapseItems: AsideHeaderItem[];
} {
    const afterMoreButtonItems = compositeItems.filter(({afterMoreButton}) => afterMoreButton);
    const regularItems = compositeItems.filter(({afterMoreButton}) => !afterMoreButton);
    const listItems = [...regularItems, ...afterMoreButtonItems];

    const allItemsHeight = getItemsHeight(listItems);
    if (allItemsHeight <= height) {
        return {listItems, collapseItems: []};
    }

    const collapseItemHeight = getItemHeight(collapseItem);

    listItems.splice(regularItems.length, 0, collapseItem);
    const collapseItems: AsideHeaderItem[] = [];

    let listHeight = allItemsHeight + collapseItemHeight;
    let index = listItems.length;
    while (listHeight > height) {
        if (index === 0) {
            break;
        }
        index--;

        const compositeItem = listItems[index];
        if (
            compositeItem.pinned ||
            compositeItem.id === COLLAPSE_ITEM_ID ||
            compositeItem.afterMoreButton
        ) {
            continue;
        }
        if (compositeItem.type === 'divider') {
            if (index + 1 < listItems.length && listItems[index + 1]?.type === 'divider') {
                listHeight -= getItemHeight(compositeItem);
                listItems.splice(index, 1);
            }
            continue;
        }
        listHeight -= getItemHeight(compositeItem);
        collapseItems.unshift(...listItems.splice(index, 1));
    }
    if (
        listItems[index]?.type === 'divider' &&
        (index === 0 || listItems[index - 1]?.type === 'divider')
    ) {
        listItems.splice(index, 1);
    }

    return {listItems, collapseItems};
}
