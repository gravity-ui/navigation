import {Ellipsis} from '@gravity-ui/icons';

import {ITEM_HEIGHT, POPUP_REGULAR_ITEM_HEIGHT} from '../../../constants';
import {MenuGroup} from '../../../types';
import {AsideHeaderItem} from '../../types';

import {COLLAPSE_ITEM_ID} from './constants';
import type {CompositeBarRow} from './grouping';

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

export function getPopupItemHeight(compositeItem: AsideHeaderItem) {
    switch (compositeItem.type) {
        case 'action':
            return 50;
        case 'divider':
            return 15;

        default:
            return POPUP_REGULAR_ITEM_HEIGHT;
    }
}

export function getItemsHeight<T extends AsideHeaderItem>(items: T[]) {
    return items.reduce((sum, item) => sum + getItemHeight(item), 0);
}

export function getPopupItemsHeight<T extends AsideHeaderItem>(items: T[]) {
    return items.reduce((sum, item) => sum + getPopupItemHeight(item), 0);
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

/**
 * Reorders items so that entries flagged with `afterMoreButton` are pushed
 * to the end. This keeps the DOM order consistent between `v1` (collapse
 * into "More") and `v2` (scrollable) modes.
 *
 * @param compositeItems items to reorder
 * @returns new array with `afterMoreButton` items moved to the end, or the
 *          same reference when no reordering is needed
 */
export function getReorderedItems(compositeItems: AsideHeaderItem[]): AsideHeaderItem[] {
    const afterMoreButtonItems = compositeItems.filter(({afterMoreButton}) => afterMoreButton);

    if (afterMoreButtonItems.length === 0) {
        return compositeItems;
    }

    const regularItems = compositeItems.filter(({afterMoreButton}) => !afterMoreButton);

    return [...regularItems, ...afterMoreButtonItems];
}

export function makeGroupHeaderAsideItem(group: MenuGroup): AsideHeaderItem {
    return {
        id: `__gn-composite-bar__group-header__${group.id}`,
        title: group.title,
        icon: group.icon,
        // Do not set `current` from children: only nested items should show selection;
        // otherwise the group header and root List row highlight the whole group block.
    };
}

export function makeOverflowGroupAsideItem(
    group: MenuGroup,
    children: AsideHeaderItem[],
): AsideHeaderItem {
    return {
        id: `__gn-composite-bar__group-overflow__${group.id}`,
        title: group.title,
        icon: group.icon,
        compositeBarMenuPopupItems: children,
        compositeBarMenuPopupTitle: group.popupTitle,
    };
}

export function getCompositeBarRowLayoutHeight(row: CompositeBarRow): number {
    if (row.kind === 'item') {
        return getItemHeight(row.item);
    }
    return getItemHeight(makeGroupHeaderAsideItem(row.group));
}

export function getReorderedCompositeBarRows(rows: CompositeBarRow[]): CompositeBarRow[] {
    const afterMoreRows = rows.filter((r) => r.kind === 'item' && r.item.afterMoreButton);

    if (afterMoreRows.length === 0) {
        return rows;
    }

    const regularRows = rows.filter((r) => !(r.kind === 'item' && r.item.afterMoreButton));

    return [...regularRows, ...afterMoreRows];
}

export function compositeBarRowsToFlatForMinHeight(rows: CompositeBarRow[]): AsideHeaderItem[] {
    const out: AsideHeaderItem[] = [];
    for (const row of rows) {
        if (row.kind === 'item') {
            out.push(row.item);
        } else {
            out.push(makeGroupHeaderAsideItem(row.group));
        }
    }
    return out;
}

export function getCompositeBarRowsMinHeight(rows: CompositeBarRow[]): number {
    return getItemsMinHeight(compositeBarRowsToFlatForMinHeight(rows));
}

export function getSelectedCompositeBarRowIndex(rows: CompositeBarRow[]): number | undefined {
    const index = rows.findIndex((row) => {
        if (row.kind === 'item') {
            return Boolean(row.item.current);
        }
        // Group rows embed their own List; selection is on nested items, not this root row.
        return false;
    });
    return index === -1 ? undefined : index;
}

export function getAutosizeCompositeBarRows(
    rows: CompositeBarRow[],
    height: number,
    collapseItem: AsideHeaderItem,
): {
    listRows: CompositeBarRow[];
    collapseItems: AsideHeaderItem[];
} {
    const ordered = getReorderedCompositeBarRows(rows);
    const afterMoreRows = ordered.filter((r) => r.kind === 'item' && r.item.afterMoreButton);
    const regularRows = ordered.filter((r) => !(r.kind === 'item' && r.item.afterMoreButton));
    const listRows: CompositeBarRow[] = [...regularRows, ...afterMoreRows];

    const allRowsHeight = listRows.reduce(
        (sum, row) => sum + getCompositeBarRowLayoutHeight(row),
        0,
    );
    if (allRowsHeight <= height) {
        return {listRows, collapseItems: []};
    }

    const collapseItemHeight = getItemHeight(collapseItem);

    listRows.splice(regularRows.length, 0, {kind: 'item', item: collapseItem});
    const collapseItems: AsideHeaderItem[] = [];

    let listHeight = allRowsHeight + collapseItemHeight;
    let index = listRows.length;
    while (listHeight > height) {
        if (index === 0) {
            break;
        }
        index--;

        const row = listRows[index];
        if (row.kind === 'item') {
            const compositeItem = row.item;
            if (
                compositeItem.pinned ||
                compositeItem.id === COLLAPSE_ITEM_ID ||
                compositeItem.afterMoreButton
            ) {
                continue;
            }
            if (compositeItem.type === 'divider') {
                const nextRow = listRows[index + 1];
                if (
                    index + 1 < listRows.length &&
                    nextRow?.kind === 'item' &&
                    nextRow.item.type === 'divider'
                ) {
                    listHeight -= getItemHeight(compositeItem);
                    listRows.splice(index, 1);
                }
                continue;
            }
            listHeight -= getItemHeight(compositeItem);
            collapseItems.unshift(
                ...listRows
                    .splice(index, 1)
                    .map((r) => (r as Extract<CompositeBarRow, {kind: 'item'}>).item),
            );
        } else {
            listHeight -= getCompositeBarRowLayoutHeight(row);
            const [removed] = listRows.splice(index, 1);
            if (removed?.kind === 'group') {
                collapseItems.unshift(makeOverflowGroupAsideItem(removed.group, removed.items));
            }
        }
    }
    const at = listRows[index];
    const prev = listRows[index - 1];
    if (
        at?.kind === 'item' &&
        at.item.type === 'divider' &&
        (index === 0 || (prev?.kind === 'item' && prev.item.type === 'divider'))
    ) {
        listRows.splice(index, 1);
    }

    return {listRows, collapseItems};
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
