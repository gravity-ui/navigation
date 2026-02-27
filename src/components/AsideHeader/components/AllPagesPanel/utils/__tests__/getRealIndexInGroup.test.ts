import {describe, expect, test} from '@jest/globals';

// eslint-disable-next-line import/order
import {MenuItemsWithGroups} from '../../../../types';

jest.mock('../../i18n', () => ({__esModule: true, default: () => ''}));

import {
    applySecondLevelSort,
    getFlatListIndexForSortableIndex,
    getGroupAtSortableIndex,
    getIndexInGroupItemsForSortableIndex,
    getRealIndexInExpandedMenu,
    getRealIndexInGroup,
    updateGroupItemsInFlatList,
} from '../getRealIndexInGroup';

const item = (
    id: string,
    type: 'regular' | 'divider' | 'action' = 'regular',
): MenuItemsWithGroups => ({
    id,
    title: id,
    type,
});

const group = (
    groupId: string,
    items: MenuItemsWithGroups[],
): MenuItemsWithGroups & {items: MenuItemsWithGroups[]} => ({
    id: groupId,
    title: groupId,
    groupId,
    items,
    collapsible: true,
    isCollapsed: false,
});

describe('getFlatListIndexForSortableIndex', () => {
    test('returns 0 for first sortable item', () => {
        const flatList = [item('a'), item('b')];

        expect(getFlatListIndexForSortableIndex(0, flatList)).toBe(0);
    });

    test('skips dividers when counting sortable index', () => {
        const flatList = [item('a'), item('d', 'divider'), item('b'), item('c')];

        expect(getFlatListIndexForSortableIndex(0, flatList)).toBe(0);
        expect(getFlatListIndexForSortableIndex(1, flatList)).toBe(2);
        expect(getFlatListIndexForSortableIndex(2, flatList)).toBe(3);
    });

    test('skips action items when counting sortable index', () => {
        const flatList = [item('a'), item('act', 'action'), item('b')];

        expect(getFlatListIndexForSortableIndex(0, flatList)).toBe(0);
        expect(getFlatListIndexForSortableIndex(1, flatList)).toBe(2);
    });

    test('returns index of group in flat list', () => {
        const flatList = [
            item('a'),
            item('d', 'divider'),
            group('g1', [item('x'), item('y')]),
            item('b'),
        ];

        expect(getFlatListIndexForSortableIndex(0, flatList)).toBe(0);
        expect(getFlatListIndexForSortableIndex(1, flatList)).toBe(2);
        expect(getFlatListIndexForSortableIndex(2, flatList)).toBe(3);
    });

    test('returns 0 when sortable index is out of range', () => {
        const flatList = [item('a')];

        expect(getFlatListIndexForSortableIndex(5, flatList)).toBe(0);
    });
});

describe('getIndexInGroupItemsForSortableIndex', () => {
    test('returns index when group has no dividers', () => {
        const groupItems = [item('a'), item('b'), item('c')];

        expect(getIndexInGroupItemsForSortableIndex(0, groupItems)).toBe(0);
        expect(getIndexInGroupItemsForSortableIndex(1, groupItems)).toBe(1);
        expect(getIndexInGroupItemsForSortableIndex(2, groupItems)).toBe(2);
    });

    test('skips dividers within group', () => {
        const groupItems = [item('a'), item('d', 'divider'), item('b'), item('c')];

        expect(getIndexInGroupItemsForSortableIndex(0, groupItems)).toBe(0);
        expect(getIndexInGroupItemsForSortableIndex(1, groupItems)).toBe(2);
        expect(getIndexInGroupItemsForSortableIndex(2, groupItems)).toBe(3);
    });

    test('returns 0 when sortable index out of range', () => {
        const groupItems = [item('a')];
        expect(getIndexInGroupItemsForSortableIndex(1, groupItems)).toBe(0);
    });
});

describe('getRealIndexInExpandedMenu', () => {
    test('returns 0 for flatListIndex 0', () => {
        expect(getRealIndexInExpandedMenu(0, [item('a')])).toBe(0);
    });

    test('counts single items as 1', () => {
        const flatList = [item('a'), item('b')];
        expect(getRealIndexInExpandedMenu(1, flatList)).toBe(1);
    });

    test('expands group items', () => {
        const flatList = [item('a'), group('g1', [item('x'), item('y'), item('z')]), item('b')];

        expect(getRealIndexInExpandedMenu(0, flatList)).toBe(0);
        expect(getRealIndexInExpandedMenu(1, flatList)).toBe(1);
        expect(getRealIndexInExpandedMenu(2, flatList)).toBe(4);
    });
});

describe('getRealIndexInGroup', () => {
    test('returns groupStart + position when group has no dividers', () => {
        const flatList = [item('a'), group('g1', [item('x'), item('y')]), item('b')];

        expect(getRealIndexInGroup(1, 0, flatList)).toBe(1);
        expect(getRealIndexInGroup(1, 1, flatList)).toBe(2);
    });

    test('accounts for dividers inside group', () => {
        const flatList = [
            item('a'),
            group('g1', [item('x'), item('d', 'divider'), item('y')]),
            item('b'),
        ];

        expect(getRealIndexInGroup(1, 0, flatList)).toBe(1);
        expect(getRealIndexInGroup(1, 1, flatList)).toBe(3);
    });
});

describe('getGroupAtSortableIndex', () => {
    test('returns group and flatListGroupIndex when sortable index points to group', () => {
        const flatList = [item('a'), item('d', 'divider'), group('g1', [item('x'), item('y')])];
        const result = getGroupAtSortableIndex(1, flatList);

        expect(result).not.toBeNull();
        expect(result?.flatListGroupIndex).toBe(2);
        expect(result?.groupItem.id).toBe('g1');
        expect(result?.groupItem.items).toHaveLength(2);
    });

    test('returns null when sortable index points to non-group item', () => {
        const flatList = [item('a'), item('b')];

        expect(getGroupAtSortableIndex(0, flatList)).toBeNull();
        expect(getGroupAtSortableIndex(1, flatList)).toBeNull();
    });

    test('returns null when sortable index points to divider (skipped, next is group)', () => {
        const flatList = [item('d', 'divider'), group('g1', [item('x')])];
        const result = getGroupAtSortableIndex(0, flatList);

        expect(result).not.toBeNull();
        expect(result?.groupItem.id).toBe('g1');
    });
});

describe('updateGroupItemsInFlatList', () => {
    test('replaces items of group at given index', () => {
        const flatList = [item('a'), group('g1', [item('x'), item('y')]), item('b')];
        const newGroupItems = [item('y'), item('x')];
        const result = updateGroupItemsInFlatList(flatList, 1, newGroupItems);

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual(item('a'));
        expect('items' in result[1] && result[1].items).toEqual(newGroupItems);
        expect(result[2]).toEqual(item('b'));
    });

    test('does not mutate original flat list', () => {
        const flatList = [item('a'), group('g1', [item('x')])];
        const result = updateGroupItemsInFlatList(flatList, 1, [item('y')]);

        expect(flatList[1]).not.toBe(result[1]);
        expect('items' in flatList[1] && (flatList[1] as {items: unknown[]}).items).toHaveLength(1);
    });

    test('leaves other indices unchanged', () => {
        const flatList = [group('g0', [item('a')]), group('g1', [item('b')])];
        const result = updateGroupItemsInFlatList(flatList, 1, [item('c')]);

        expect('items' in result[0] && result[0].items).toEqual([item('a')]);
        expect('items' in result[1] && result[1].items).toEqual([item('c')]);
    });
});

describe('applySecondLevelSort', () => {
    test('returns null when groupIndex does not point to a group', () => {
        const flatList = [item('a'), item('b')];
        expect(applySecondLevelSort(0, 0, 1, flatList)).toBeNull();
    });

    test('reorders items within group and preserves dividers', () => {
        const flatList = [
            item('top'),
            group('g1', [item('a'), item('d', 'divider'), item('b'), item('c')]),
        ];
        // move sortable index 2 (c) to index 0 → order [c, a, b], divider stays at 1
        const result = applySecondLevelSort(1, 2, 0, flatList);

        const groupInResult = result?.newFlatList[1];
        expect((groupInResult as {items: MenuItemsWithGroups[]}).items).toEqual([
            item('c'),
            item('d', 'divider'),
            item('a'),
            item('b'),
        ]);
        expect(result?.realOldIndex).toBe(4);
        expect(result?.realNewIndex).toBe(1);
        expect(result?.changedItem?.id).toBe('c');
    });

    test('expandedItems reflect new order', () => {
        const flatList = [item('top'), group('g1', [item('a'), item('b')])];
        const result = applySecondLevelSort(1, 1, 0, flatList);

        expect(result).not.toBeNull();
        expect(result?.expandedItems.map((i) => i.id)).toEqual(['top', 'b', 'a']);
    });

    test('returns null for invalid oldIndex', () => {
        const flatList = [group('g1', [item('a')])];
        const result = applySecondLevelSort(0, 5, 0, flatList);

        expect(result).not.toBeNull();
        expect(result?.newFlatList).toBeDefined();
    });
});
