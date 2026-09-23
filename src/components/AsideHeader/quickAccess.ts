import {MenuGroup} from '../types';

import {COLLAPSE_ITEM_ID} from './components/CompositeBar/constants';
import {ALL_PAGES_ID, AsideHeaderItem} from './types';

type QuickAccessPinCandidate = Pick<
    AsideHeaderItem,
    'id' | 'type' | 'hidden' | 'quickAccess' | 'compositeBarMenuPopupItems'
> & {
    groupHeaderExpanded?: boolean;
};

export function isQuickAccessPinEligible(item: QuickAccessPinCandidate): boolean {
    if (item.hidden || item.groupHeaderExpanded !== undefined) {
        return false;
    }

    if (item.type === 'divider' || item.type === 'action') {
        return false;
    }

    if (item.id === COLLAPSE_ITEM_ID || item.id === ALL_PAGES_ID) {
        return false;
    }

    return !item.compositeBarMenuPopupItems?.length;
}

export function isQuickAccessMenuItem(item: AsideHeaderItem): boolean {
    return Boolean(item.quickAccess) && isQuickAccessPinEligible(item);
}

export function getQuickAccessMenuItems(
    items: AsideHeaderItem[],
    menuGroups?: MenuGroup[],
): AsideHeaderItem[] {
    const hiddenGroupIds = new Set(
        menuGroups?.filter((group) => group.hidden).map((group) => group.id) ?? [],
    );

    return items.filter(
        (item) =>
            isQuickAccessMenuItem(item) && (!item.groupId || !hiddenGroupIds.has(item.groupId)),
    );
}
