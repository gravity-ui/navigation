import {describe, expect, test} from '@jest/globals';

import {AsideHeaderItem} from '../../../types';
import {filterRedundantDividers, getVisibleItemsWithFilteredDividers} from '../utils';

const ALL_PAGES_ID = 'all-pages';

const item = (id: string, type: 'regular' | 'divider' | 'action' = 'regular'): AsideHeaderItem => ({
    id,
    title: id,
    type,
});
const hidden = (id: string, type: 'regular' | 'divider' = 'regular'): AsideHeaderItem => ({
    id,
    title: id,
    type,
    hidden: true,
});

describe('filterRedundantDividers', () => {
    test('returns empty array for empty input', () => {
        expect(filterRedundantDividers([])).toEqual([]);
    });

    test('returns empty array when all items are dividers', () => {
        expect(filterRedundantDividers([item('d1', 'divider'), item('d2', 'divider')])).toEqual([]);
    });

    test('removes all dividers when only item is allPagesId', () => {
        expect(filterRedundantDividers([item(ALL_PAGES_ID)], ALL_PAGES_ID)).toEqual([
            item(ALL_PAGES_ID),
        ]);
        expect(
            filterRedundantDividers([item(ALL_PAGES_ID), item('d', 'divider')], ALL_PAGES_ID),
        ).toEqual([item(ALL_PAGES_ID)]);
    });

    test('keeps single non-allPages item with dividers', () => {
        const input = [item('a'), item('d', 'divider'), item('d2', 'divider')];
        expect(filterRedundantDividers(input, ALL_PAGES_ID)).toEqual([item('a')]);
    });

    test('collapses consecutive dividers to one', () => {
        const input = [
            item('a'),
            item('d1', 'divider'),
            item('d2', 'divider'),
            item('d3', 'divider'),
            item('b'),
        ];
        expect(filterRedundantDividers(input)).toEqual([
            item('a'),
            item('d1', 'divider'),
            item('b'),
        ]);
    });

    test('removes leading and trailing dividers', () => {
        const input = [
            item('d0', 'divider'),
            item('d1', 'divider'),
            item('a'),
            item('d2', 'divider'),
            item('d3', 'divider'),
        ];
        expect(filterRedundantDividers(input)).toEqual([item('a')]);
    });

    test('returns empty when only dividers (after leading/trailing removal)', () => {
        const input = [item('d1', 'divider'), item('d2', 'divider')];
        expect(filterRedundantDividers(input)).toEqual([]);
    });

    test('without allPagesId does not treat single item as no content', () => {
        const input = [item(ALL_PAGES_ID), item('d', 'divider')];

        expect(filterRedundantDividers(input)).toEqual([item(ALL_PAGES_ID)]);
    });
});

describe('getVisibleItemsWithFilteredDividers', () => {
    test('filters out hidden items', () => {
        const input = [item('a'), hidden('b'), item('c')];
        expect(getVisibleItemsWithFilteredDividers(input)).toEqual([item('a'), item('c')]);
    });

    test('filters nested hidden and redundant dividers in groups', () => {
        const input = [
            {
                ...item('g1'),
                groupId: 'g1',
                items: [
                    item('a'),
                    item('d1', 'divider'),
                    item('d2', 'divider'),
                    hidden('b'),
                    item('c'),
                ],
            },
        ];
        const result = getVisibleItemsWithFilteredDividers(input, ALL_PAGES_ID);
        expect(result).toHaveLength(1);
        expect('items' in result[0] && result[0].items).toEqual([
            item('a'),
            item('d1', 'divider'),
            item('c'),
        ]);
    });

    test('does not add items property to non-group items', () => {
        const input = [item('a'), item('b')];
        const result = getVisibleItemsWithFilteredDividers(input);
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual(item('a'));
        expect(result[1]).toEqual(item('b'));
        expect('items' in result[0]).toBe(false);
        expect('items' in result[1]).toBe(false);
    });
});
