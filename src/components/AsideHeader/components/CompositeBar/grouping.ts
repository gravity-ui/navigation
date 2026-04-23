import {MenuGroup} from '../../../types';
import {AsideHeaderItem} from '../../types';

export type CompositeBarRow =
    | {kind: 'item'; item: AsideHeaderItem}
    | {kind: 'group'; group: MenuGroup; items: AsideHeaderItem[]};

/**
 * Builds ordered rows for CompositeBar: flat items and grouped sections.
 * Hidden items are omitted; group rows are placed at the index of the first visible child.
 */
export function buildCompositeBarRows(
    items: AsideHeaderItem[],
    groups: MenuGroup[] | undefined,
): CompositeBarRow[] {
    if (!groups || groups.length === 0) {
        return items.map((item) => ({kind: 'item' as const, item}));
    }

    const visibleGroups = groups.filter((g) => !g.hidden);
    if (visibleGroups.length === 0) {
        return items.map((item) => ({kind: 'item' as const, item}));
    }

    const groupMap = new Map<string, MenuGroup>();
    for (const group of visibleGroups) {
        groupMap.set(group.id, group);
    }

    const groupChildrenMap = new Map<string, AsideHeaderItem[]>();
    const ungroupedItems: Array<{index: number; row: CompositeBarRow}> = [];
    const groupFirstIndex = new Map<string, number>();

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.hidden) {
            continue;
        }

        const groupId = item.groupId;

        if (groupId && groupMap.has(groupId)) {
            let groupChildren = groupChildrenMap.get(groupId);

            if (!groupChildren) {
                groupChildren = [];
                groupChildrenMap.set(groupId, groupChildren);
                groupFirstIndex.set(groupId, i);
            }

            groupChildren.push(item);
        } else {
            ungroupedItems.push({index: i, row: {kind: 'item' as const, item}});
        }
    }

    const result: Array<{index: number; row: CompositeBarRow}> = [...ungroupedItems];

    for (const [groupId, children] of groupChildrenMap.entries()) {
        const visibleChildren = children.filter((c) => !c.hidden);
        if (visibleChildren.length === 0) {
            continue;
        }

        const group = groupMap.get(groupId);
        const firstIndex = groupFirstIndex.get(groupId);

        if (!group || firstIndex === undefined) {
            continue;
        }

        result.push({
            index: firstIndex,
            row: {kind: 'group' as const, group, items: visibleChildren},
        });
    }

    result.sort((a, b) => a.index - b.index);
    return result.map((r) => r.row);
}
