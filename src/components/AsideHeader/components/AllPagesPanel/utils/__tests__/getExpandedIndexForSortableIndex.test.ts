import {describe, expect, test} from '@jest/globals';

// eslint-disable-next-line import/order
import {MenuItemsWithGroups} from '../../../../types';

jest.mock('../../i18n', () => ({__esModule: true, default: () => ''}));

import {getExpandedIndexForSortableIndex} from '../getExpandedIndexForSortableIndex';

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

describe('getExpandedIndexForSortableIndex', () => {
    test('returns 0 for first sortable item', () => {
        const flatList = [item('a'), item('b')];
        expect(getExpandedIndexForSortableIndex(0, flatList)).toBe(0);
    });

    test('returns expanded index for second sortable item', () => {
        const flatList = [item('a'), item('b'), item('c')];
        expect(getExpandedIndexForSortableIndex(0, flatList)).toBe(0);
        expect(getExpandedIndexForSortableIndex(1, flatList)).toBe(1);
        expect(getExpandedIndexForSortableIndex(2, flatList)).toBe(2);
    });

    test('skips dividers and returns expanded index', () => {
        const flatList = [item('a'), item('d', 'divider'), item('b'), item('c')];
        expect(getExpandedIndexForSortableIndex(0, flatList)).toBe(0);
        expect(getExpandedIndexForSortableIndex(1, flatList)).toBe(2);
        expect(getExpandedIndexForSortableIndex(2, flatList)).toBe(3);
    });

    test('skips action items when counting sortable index', () => {
        const flatList = [item('a'), item('act', 'action'), item('b')];
        expect(getExpandedIndexForSortableIndex(0, flatList)).toBe(0);
        expect(getExpandedIndexForSortableIndex(1, flatList)).toBe(2);
    });

    test('returns start index of group in expanded list', () => {
        const flatList = [item('a'), group('g1', [item('x'), item('y')]), item('b')];
        // expanded: [a, x, y, b] — sortable 0 = a at 0, sortable 1 = group start at 1, sortable 2 = b at 3
        expect(getExpandedIndexForSortableIndex(0, flatList)).toBe(0);
        expect(getExpandedIndexForSortableIndex(1, flatList)).toBe(1);
        expect(getExpandedIndexForSortableIndex(2, flatList)).toBe(3);
    });

    test('returns 0 when sortable index is out of range', () => {
        const flatList = [item('a')];
        expect(getExpandedIndexForSortableIndex(5, flatList)).toBe(0);
    });
});
