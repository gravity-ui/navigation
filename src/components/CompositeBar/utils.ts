import {Ellipsis} from '@gravity-ui/icons';
import {AsideHeaderDict, Dict, MenuItem} from './../types';
import {COLLAPSE_ITEM_ID, ITEM_HEIGHT} from './constants';
import {defaultDict} from '../constants';

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

export function getMoreButtonItem(dict?: AsideHeaderDict): MenuItem {
    const title = dict?.[Dict.MoreButton] ?? defaultDict[Dict.MoreButton];

    return {
        id: COLLAPSE_ITEM_ID,
        title,
        icon: Ellipsis,
        iconSize: 18,
    };
}

export function getAutosizeListItems(
    items: MenuItem[],
    height: number,
    collapseItem: MenuItem,
): {
    listItems: MenuItem[];
    collapseItems: MenuItem[];
} {
    const afterMoreButtonItems = items.filter((item) => item.afterMoreButton);
    const regularItems = items.filter((item) => !item.afterMoreButton);
    const listItems = [...regularItems, ...afterMoreButtonItems];

    const allItemsHeight = getItemsHeight(listItems);
    if (allItemsHeight <= height) {
        return {listItems, collapseItems: []};
    }

    const collapseItemHeight = getItemHeight(collapseItem);

    listItems.splice(regularItems.length, 0, collapseItem);
    const collapseItems: MenuItem[] = [];

    let listHeight = allItemsHeight + collapseItemHeight;
    let index = listItems.length;
    while (listHeight > height) {
        if (index === 0) {
            break;
        }
        index--;

        const item = listItems[index];
        if (item.pinned || item.id === COLLAPSE_ITEM_ID || item.afterMoreButton) {
            continue;
        }
        if (item.type === 'divider') {
            if (index + 1 < listItems.length && listItems[index + 1]?.type === 'divider') {
                listHeight -= getItemHeight(item);
                listItems.splice(index, 1);
            }
            continue;
        }
        listHeight -= getItemHeight(item);
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
export type Callback<R, A extends unknown[] = []> = (...args: A) => R;

export type SideEffect<A extends unknown[] = []> = Callback<void, A>;

export function invokeCallbacks<A extends unknown[]>(
    ...callbacks: Array<SideEffect<A> | undefined>
) {
    return (...args: A) => {
        callbacks.forEach((callback) => callback?.(...args));
    };
}

// export function callIf(condition: boolean | undefined, cb: (...args: unknown[]) => unknown) {
//     return condition ? cb : () => undefined;
// }
