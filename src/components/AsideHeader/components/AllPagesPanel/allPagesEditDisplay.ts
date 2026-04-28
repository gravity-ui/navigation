import type {MenuGroup} from '../../../types';
import {AsideHeaderItem} from '../../types';
import {
    type CompositeBarRow,
    buildCompositeBarRows,
    flattenCompositeBarRows,
} from '../CompositeBar/grouping';
import {makeGroupHeaderAsideItem} from '../CompositeBar/utils';

export const COMPOSITE_BAR_GROUP_HEADER_ID_PREFIX = '__gn-composite-bar__group-header__' as const;

/** Options passed to {@link buildCompositeBarRows} for All pages panel (edit-mode rows). */
export const ALL_PAGES_PANEL_ROW_BUILD_OPTIONS = {
    includeHidden: true,
    includeHiddenGroups: true,
} as const;

export function isCompositeBarGroupHeaderItem(item: AsideHeaderItem): boolean {
    return item.id.startsWith(COMPOSITE_BAR_GROUP_HEADER_ID_PREFIX);
}

export function getCompositeBarHeaderGroupId(itemId: string): string | undefined {
    if (!itemId.startsWith(COMPOSITE_BAR_GROUP_HEADER_ID_PREFIX)) {
        return undefined;
    }
    return itemId.slice(COMPOSITE_BAR_GROUP_HEADER_ID_PREFIX.length);
}

export function rowsToAllPagesDisplayItems(
    rows: CompositeBarRow[],
    options?: {enableGroupHeaderPins?: boolean},
): AsideHeaderItem[] {
    const showPins = Boolean(options?.enableGroupHeaderPins);
    return rows.map((row) => {
        if (row.kind === 'item') {
            return row.item;
        }
        const header = makeGroupHeaderAsideItem(row.group);
        const firstCategory = row.items[0]?.category;
        return {
            ...header,
            category: firstCategory ?? row.group.title,
            hidden: Boolean(row.group.hidden),
            preventUserRemoving: !showPins,
        };
    });
}

/**
 * Edit-mode list: top-level items + one row per menu group (header only), same order as CompositeBar.
 */
export function getAllPagesEditModeFlatItems(
    asideHeaderItems: AsideHeaderItem[],
    menuGroups: MenuGroup[] | undefined,
    options?: {enableGroupHeaderPins?: boolean},
): AsideHeaderItem[] {
    if (!menuGroups?.length) {
        return asideHeaderItems.filter((item) => !item.groupId);
    }
    const rows = buildCompositeBarRows(
        asideHeaderItems,
        menuGroups,
        ALL_PAGES_PANEL_ROW_BUILD_OPTIONS,
    );
    return rowsToAllPagesDisplayItems(rows, options);
}

export function reorderMenuItemsByCompositeBarRows(
    withoutAllPagesNoDividers: AsideHeaderItem[],
    menuGroups: MenuGroup[],
    oldIndex: number,
    newIndex: number,
): AsideHeaderItem[] {
    const rows = buildCompositeBarRows(
        withoutAllPagesNoDividers,
        menuGroups,
        ALL_PAGES_PANEL_ROW_BUILD_OPTIONS,
    );
    const reordered = [...rows];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved!);
    return flattenCompositeBarRows(reordered);
}
