import type {AsideHeaderItem} from '../../types';

type PresentationCurrentOptions = {
    suppressCurrentItemIds?: ReadonlySet<string>;
    popupItems?: AsideHeaderItem[];
};

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
    const {suppressCurrentItemIds, popupItems = item.compositeBarMenuPopupItems} = options;

    if (item.current && !suppressCurrentItemIds?.has(item.id)) {
        return true;
    }

    return Boolean(
        popupItems?.some((popupItem) =>
            isItemPresentationCurrent(popupItem, {suppressCurrentItemIds}),
        ),
    );
}
