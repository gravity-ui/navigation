import {COLLAPSE_ITEM_ID} from './components/CompositeBar/constants';
import {ALL_PAGES_ID, AsideHeaderItem} from './types';

type QuickAccessPinCandidate = Pick<
    AsideHeaderItem,
    'id' | 'type' | 'compositeBarMenuPopupItems'
> & {
    groupHeaderExpanded?: boolean;
};

export function isQuickAccessPinEligible(item: QuickAccessPinCandidate): boolean {
    if (item.groupHeaderExpanded !== undefined) {
        return false;
    }

    if (item.type === 'divider' || item.type === 'action') {
        return false;
    }

    if (item.id === COLLAPSE_ITEM_ID || item.id === ALL_PAGES_ID) {
        return false;
    }

    if (item.compositeBarMenuPopupItems?.length) {
        return false;
    }

    return true;
}

export function isQuickAccessMenuItem(item: AsideHeaderItem): boolean {
    return Boolean(item.quickAccess) && isQuickAccessPinEligible(item);
}

export function getMainMenuItemsForDisplay(
    visibleMenuItems: AsideHeaderItem[],
    quickAccessItems: AsideHeaderItem[],
): AsideHeaderItem[] {
    if (quickAccessItems.length === 0) {
        return visibleMenuItems;
    }

    const pinnedIds = new Set(quickAccessItems.map(({id}) => id));

    return visibleMenuItems.map((item) =>
        pinnedIds.has(item.id) ? {...item, current: false} : item,
    );
}
