import {describe, expect, test} from '@jest/globals';

// eslint-disable-next-line import/order
import {MenuItemsWithGroups} from '../../../../types';

jest.mock('../../i18n', () => ({__esModule: true, default: () => ''}));

import {sortMenuItemsWithDividers} from '../sortMenuItemsWithDividers';

const item = (
    id: string,
    type: 'regular' | 'divider' | 'action' = 'regular',
): MenuItemsWithGroups => ({
    id,
    title: id,
    type,
});

describe('sortMenuItemsWithDividers', () => {
    test('reorders sortable items when no dividers or actions', () => {
        const flatList = [item('a'), item('b'), item('c')];
        const result = sortMenuItemsWithDividers(2, 0, flatList);
        expect(result.map((i) => i.id)).toEqual(['c', 'a', 'b']);
    });

    test('preserves dividers at their original positions', () => {
        const flatList = [
            item('a'),
            item('d1', 'divider'),
            item('b'),
            item('d2', 'divider'),
            item('c'),
        ];
        // move sortable index 2 (c) to index 0 → order [c, a, b], dividers stay at 1 and 3
        const result = sortMenuItemsWithDividers(2, 0, flatList);
        expect(result[0].id).toBe('c');
        expect(result[1].type).toBe('divider');
        expect(result[1].id).toBe('d1');
        expect(result[2].id).toBe('a');
        expect(result[3].type).toBe('divider');
        expect(result[3].id).toBe('d2');
        expect(result[4].id).toBe('b');
    });

    test('preserves action items at their original positions', () => {
        const flatList = [item('a'), item('act', 'action'), item('b'), item('c')];
        // move sortable index 2 (c) to index 0 → order [c, a, b], action stays at 1
        const result = sortMenuItemsWithDividers(2, 0, flatList);
        expect(result[0].id).toBe('c');
        expect(result[1].type).toBe('action');
        expect(result[1].id).toBe('act');
        expect(result[2].id).toBe('a');
        expect(result[3].id).toBe('b');
    });

    test('preserves both dividers and action items when reordering', () => {
        const flatList = [
            item('a'),
            item('d', 'divider'),
            item('act', 'action'),
            item('b'),
            item('c'),
        ];
        // move sortable index 1 (b) to index 0 → order [b, a, c]
        const result = sortMenuItemsWithDividers(1, 0, flatList);
        expect(result.map((i) => `${i.id}:${i.type ?? 'regular'}`)).toEqual([
            'b:regular',
            'd:divider',
            'act:action',
            'a:regular',
            'c:regular',
        ]);
    });

    test('returns unchanged list when oldIndex is out of range', () => {
        const flatList = [item('a'), item('b')];
        const result = sortMenuItemsWithDividers(5, 0, flatList);

        expect(result).toBe(flatList);
    });

    test('returns unchanged list when newIndex is out of range', () => {
        const flatList = [item('a'), item('b')];
        const result = sortMenuItemsWithDividers(0, 5, flatList);

        expect(result).toBe(flatList);
    });

    test('same index returns list with same order', () => {
        const flatList = [item('a'), item('d', 'divider'), item('b')];
        const result = sortMenuItemsWithDividers(1, 1, flatList);

        expect(result.map((i) => i.id)).toEqual(['a', 'd', 'b']);
    });

    test('does not mutate original list', () => {
        const flatList = [item('a'), item('b'), item('c')];
        const result = sortMenuItemsWithDividers(0, 2, flatList);

        expect(flatList.map((i) => i.id)).toEqual(['a', 'b', 'c']);
        expect(result).not.toBe(flatList);
    });
});
