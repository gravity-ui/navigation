import {MenuGroup} from '../../../types';
import {AsideHeaderItem} from '../../types';

const GROUP_HEADER_ITEM_PREFIX = '__gn-composite-bar__group-header__';

interface GroupHeaderItem extends AsideHeaderItem {
    isGroupHeader: true;
    groupChildren: AsideHeaderItem[];
    /** Optional title shown at the top of the compact popup listing group children. */
    groupPopupTitle?: string;
}

export function isGroupHeaderItem(
    item: AsideHeaderItem | GroupHeaderItem,
): item is GroupHeaderItem {
    return 'isGroupHeader' in item && item.isGroupHeader;
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
            ungroupedItems.push({index: i, item});
        }
    }

    const result: Array<{index: number; item: AsideHeaderItem}> = [...ungroupedItems];

    for (const [groupId, children] of groupChildrenMap.entries()) {
        if (children.length === 0) continue;

        const group = groupMap.get(groupId);
        const firstIndex = groupFirstIndex.get(groupId);

        if (!group || firstIndex === undefined) {
            continue;
        }

        const hasCurrent = children.some((child) => child.current);

        const groupHeaderItem: GroupHeaderItem = {
            id: `${GROUP_HEADER_ITEM_PREFIX}${groupId}`,
            title: group.title,
            icon: group.icon,
            current: hasCurrent,
            isGroupHeader: true,
            groupChildren: children,
            groupPopupTitle: group.popupTitle,
        };

        result.push({index: firstIndex, item: groupHeaderItem});
    }

    result.sort((a, b) => a.index - b.index);
    return result.map((r) => r.item);
}
