import type {MenuGroup} from '../../../types';
import {AsideHeaderItem} from '../../types';
import {COMPOSITE_BAR_GROUP_HEADER_ID_PREFIX} from '../CompositeBar/constants';
import {
    type CompositeBarRow,
    buildCompositeBarRows,
    flattenCompositeBarRows,
} from '../CompositeBar/grouping';
import {makeGroupHeaderAsideItem} from '../CompositeBar/utils';

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
 * View-mode list: original items plus a clickable header row for each group that has
 * its own action (`MenuGroup.onItemClick` / `href`), inserted before the group's first
 * item; actionable groups without items are appended at the end. Groups without an
 * action are not represented by a row, as before.
 */
export function getAllPagesViewModeFlatItems(
    asideHeaderItems: AsideHeaderItem[],
    menuGroups: MenuGroup[] | undefined,
): AsideHeaderItem[] {
    const clickableGroups = (menuGroups ?? []).filter((group) => group.onItemClick || group.href);

    if (clickableGroups.length === 0) {
        return asideHeaderItems;
    }

    const clickableGroupsById = new Map(clickableGroups.map((group) => [group.id, group]));

    const makeHeaderRow = (group: MenuGroup, category?: string): AsideHeaderItem => ({
        ...makeGroupHeaderAsideItem(group),
        category,
        hidden: Boolean(group.hidden),
        href: group.href,
        onItemClick: group.onItemClick,
    });

    const insertedGroupIds = new Set<string>();
    const result: AsideHeaderItem[] = [];

    for (const item of asideHeaderItems) {
        const group = item.groupId ? clickableGroupsById.get(item.groupId) : undefined;

        if (group && !insertedGroupIds.has(group.id)) {
            insertedGroupIds.add(group.id);
            result.push(makeHeaderRow(group, item.category));
        }

        result.push(item);
    }

    for (const group of clickableGroups) {
        if (!insertedGroupIds.has(group.id)) {
            result.push(makeHeaderRow(group));
        }
    }

    return result;
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

    if (moved === undefined) {
        return flattenCompositeBarRows(rows);
    }

    reordered.splice(newIndex, 0, moved);

    return flattenCompositeBarRows(reordered);
}
