import {ITEM_GAP, ITEM_HEIGHT, ITEM_HEIGHT_COMPACT} from '../../../constants';
import {AsideHeaderItem, GroupedMenuItem, MenuItemsWithGroups} from '../../types';
import {getGroupBlockHeight} from '../../utils/getGroupHeight';
import {ALL_PAGES_ID} from '../AllPagesPanel/constants';

function getGroupHeight(compositeItem: GroupedMenuItem, isCompactMode?: boolean) {
    const visibleGroupItems = compositeItem.isCollapsed ? [] : compositeItem.items;

    return getGroupBlockHeight(visibleGroupItems, isCompactMode);
}

export function getItemHeight(compositeItem: MenuItemsWithGroups, isCompactMode?: boolean) {
    if ('items' in compositeItem && compositeItem.items && compositeItem.items?.length > 0) {
        return getGroupHeight(compositeItem, isCompactMode);
    }

    switch (compositeItem.type) {
        case 'action':
            return 50;
        case 'divider':
            return 15;

        default:
            return isCompactMode ? ITEM_HEIGHT_COMPACT : ITEM_HEIGHT;
    }
}

export function getItemsHeight<T extends AsideHeaderItem>(items: T[], isCompactMode?: boolean) {
    const gaps = items.length > 1 ? (items.length - 1) * ITEM_GAP : 0;

    return items.reduce((sum, item) => sum + getItemHeight(item, isCompactMode), 0) + gaps;
}

export function getSelectedItemIndex(compositeItems: AsideHeaderItem[]) {
    const index = compositeItems.findIndex(({current}) => Boolean(current));
    return index === -1 ? undefined : index;
}

/** Removes consecutive dividers so that at most one divider is shown between other items. */
export function filterConsecutiveDividers<T extends AsideHeaderItem>(items: T[]): T[] {
    return items.filter((item, index) => {
        if (item.type !== 'divider') {
            return true;
        }

        const prev = items[index - 1];

        return prev?.type !== 'divider';
    });
}

/** Removes dividers from the start and end of the list. */
function filterLeadingAndTrailingDividers<T extends AsideHeaderItem>(items: T[]): T[] {
    const firstNonDividerIndex = items.findIndex((item) => item.type !== 'divider');

    if (firstNonDividerIndex === -1) {
        return [];
    }

    let lastNonDividerIndex = items.length - 1;

    while (
        lastNonDividerIndex >= firstNonDividerIndex &&
        items[lastNonDividerIndex].type === 'divider'
    ) {
        lastNonDividerIndex--;
    }

    if (lastNonDividerIndex < firstNonDividerIndex) {
        return [];
    }
    return items.slice(firstNonDividerIndex, lastNonDividerIndex + 1);
}

export function getVisibleItemsWithFilteredDividers(
    items: MenuItemsWithGroups[] | undefined,
): MenuItemsWithGroups[] | undefined {
    if (!items) {
        return undefined;
    }

    const visible = items
        .filter((item) => !item.hidden)
        .map((item) => ({
            ...item,
            items:
                'items' in item && item.items
                    ? filterRedundantDividers(item.items.filter((nested) => !nested.hidden))
                    : [],
        }));

    return filterRedundantDividers(visible);
}

export function filterRedundantDividers<T extends AsideHeaderItem>(items: T[]): T[] {
    const nonDividers = items.filter((item) => item.type !== 'divider');
    const hasNoNonDividers = nonDividers.length === 0;
    const isOnlyAllPagesItem = nonDividers.length === 1 && nonDividers[0].id === ALL_PAGES_ID;
    const hasNoRealContent = hasNoNonDividers || isOnlyAllPagesItem;

    if (hasNoRealContent) {
        return nonDividers;
    }

    return filterLeadingAndTrailingDividers(filterConsecutiveDividers(items));
}
