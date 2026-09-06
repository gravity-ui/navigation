import type {AsideHeaderItem} from '../../types';

type PresentationCurrentOptions = {
    suppressCurrentItemIds?: ReadonlySet<string>;
    popupItems?: AsideHeaderItem[];
};

function collectItemPresentationCurrentIds(
    item: AsideHeaderItem,
    suppressCurrentItemIds: ReadonlySet<string> | undefined,
    popupItems: AsideHeaderItem[] | undefined,
    currentIds: Set<string>,
) {
    if (item.current && !suppressCurrentItemIds?.has(item.id)) {
        currentIds.add(item.id);
    }

    popupItems?.forEach((popupItem) => {
        collectItemPresentationCurrentIds(
            popupItem,
            suppressCurrentItemIds,
            popupItem.compositeBarMenuPopupItems,
            currentIds,
        );
    });
}

/**
 * Resolves the semantic ids represented by a visually current row. Popup parents aggregate the
 * ids recursively, while synthetic group and More rows contribute only their current descendants.
 *
 * @param item - The row item whose presentation state is being resolved.
 * @param options - Suppression and optional popup children resolved by the caller.
 * @returns Sorted unique ids of unsuppressed current items represented by the row.
 */
export function getItemPresentationCurrentIds(
    item: AsideHeaderItem,
    options: PresentationCurrentOptions = {},
): string[] {
    const {suppressCurrentItemIds, popupItems = item.compositeBarMenuPopupItems} = options;
    const currentIds = new Set<string>();

    collectItemPresentationCurrentIds(item, suppressCurrentItemIds, popupItems, currentIds);

    return Array.from(currentIds).sort();
}

/**
 * Resolves the visual current state without changing the public item. Popup parents aggregate the
 * state recursively, so group and More rows follow the same suppression rules as leaf rows.
 *
 * @param item - The row item whose presentation state is being resolved.
 * @param options - Suppression and optional popup children resolved by the caller.
 * @returns Whether the row or one of its popup descendants should look current.
 */
export function isItemPresentationCurrent(
    item: AsideHeaderItem,
    options: PresentationCurrentOptions = {},
): boolean {
    return getItemPresentationCurrentIds(item, options).length > 0;
}
