import type {MenuGroup} from '../../../types';
import {AsideHeaderItem} from '../../types';
import {
    type CompositeBarRow,
    buildCompositeBarRows,
    flattenCompositeBarRows,
} from '../CompositeBar/grouping';
import {makeGroupHeaderAsideItem} from '../CompositeBar/utils';

const COMPOSITE_BAR_GROUP_HEADER_ID_PREFIX = '__gn-composite-bar__group-header__' as const;

export function isCompositeBarGroupHeaderItem(item: AsideHeaderItem): boolean {
    return item.id.startsWith(COMPOSITE_BAR_GROUP_HEADER_ID_PREFIX);
}

export function rowsToAllPagesDisplayItems(rows: CompositeBarRow[]): AsideHeaderItem[] {
    return rows.map((row) => {
        if (row.kind === 'item') {
            return row.item;
        }
        const header = makeGroupHeaderAsideItem(row.group);
        const firstCategory = row.items[0]?.category;
        return {
            ...header,
            category: firstCategory ?? row.group.title,
            preventUserRemoving: true,
        };
    });
}

/**
 * Edit-mode list: top-level items + one row per menu group (header only), same order as CompositeBar.
 */
export function getAllPagesEditModeFlatItems(
    asideHeaderItems: AsideHeaderItem[],
    menuGroups: MenuGroup[] | undefined,
): AsideHeaderItem[] {
    if (!menuGroups?.length) {
        return asideHeaderItems.filter((item) => !item.groupId);
    }
    const rows = buildCompositeBarRows(asideHeaderItems, menuGroups, {includeHidden: true});
    return rowsToAllPagesDisplayItems(rows);
}

export function reorderMenuItemsByCompositeBarRows(
    withoutAllPagesNoDividers: AsideHeaderItem[],
    menuGroups: MenuGroup[],
    oldIndex: number,
    newIndex: number,
): AsideHeaderItem[] {
    const rows = buildCompositeBarRows(withoutAllPagesNoDividers, menuGroups, {
        includeHidden: true,
    });
    const reordered = [...rows];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved!);
    return flattenCompositeBarRows(reordered);
}
