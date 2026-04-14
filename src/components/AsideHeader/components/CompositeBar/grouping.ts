import {MenuGroup} from '../../../types';
import {AsideHeaderItem} from '../../types';

export const GROUP_HEADER_ITEM_PREFIX = '__group-header-';

export interface GroupHeaderItem extends AsideHeaderItem {
    _isGroupHeader: true;
    _groupChildren: AsideHeaderItem[];
}

export function isGroupHeaderItem(item: AsideHeaderItem): item is GroupHeaderItem {
    return '_isGroupHeader' in item && (item as GroupHeaderItem)._isGroupHeader === true;
}

export function getGroupedItems(
    items: AsideHeaderItem[],
    groups: MenuGroup[] | undefined,
): AsideHeaderItem[] {
    if (!groups || groups.length === 0) {
        return items;
    }

    const visibleGroups = groups.filter((g) => !g.hidden);
    if (visibleGroups.length === 0) {
        return items;
    }

    const groupMap = new Map<string, MenuGroup>();
    for (const group of visibleGroups) {
        groupMap.set(group.id, group);
    }

    const groupChildrenMap = new Map<string, AsideHeaderItem[]>();
    const ungroupedItems: Array<{index: number; item: AsideHeaderItem}> = [];
    const groupFirstIndex = new Map<string, number>();

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const groupId = item.groupId;

        if (groupId && groupMap.has(groupId)) {
            if (!groupChildrenMap.has(groupId)) {
                groupChildrenMap.set(groupId, []);
                groupFirstIndex.set(groupId, i);
            }
            if (!item.hidden) {
                groupChildrenMap.get(groupId)!.push(item);
            }
        } else {
            ungroupedItems.push({index: i, item});
        }
    }

    const result: Array<{index: number; item: AsideHeaderItem}> = [...ungroupedItems];

    for (const [groupId, children] of groupChildrenMap.entries()) {
        if (children.length === 0) continue;

        const group = groupMap.get(groupId)!;
        const hasCurrent = children.some((child) => child.current);

        const groupHeaderItem: GroupHeaderItem = {
            id: `${GROUP_HEADER_ITEM_PREFIX}${groupId}`,
            title: group.title,
            icon: group.icon,
            current: hasCurrent,
            _isGroupHeader: true,
            _groupChildren: children,
        };

        result.push({index: groupFirstIndex.get(groupId)!, item: groupHeaderItem});
    }

    result.sort((a, b) => a.index - b.index);
    return result.map((r) => r.item);
}
