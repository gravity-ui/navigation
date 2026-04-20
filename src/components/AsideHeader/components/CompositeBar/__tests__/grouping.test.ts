import {MenuGroup} from '../../../../types';
import {AsideHeaderItem} from '../../../types';
import {getGroupedItems, isGroupHeaderItem} from '../grouping';

describe('getGroupedItems', () => {
    describe('pass-through paths (no grouping applied)', () => {
        it('returns items as-is when groups is undefined', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A'},
                {id: 'b', title: 'B', hidden: true},
            ];

            expect(getGroupedItems(items, undefined)).toBe(items);
        });

        it('returns items as-is when groups is empty', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A'},
                {id: 'b', title: 'B', hidden: true},
            ];

            expect(getGroupedItems(items, [])).toBe(items);
        });

        it('returns items as-is when all provided groups are hidden', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A'},
                {id: 'b', title: 'B', hidden: true},
            ];
            const groups: MenuGroup[] = [{id: 'g1', title: 'G1', hidden: true}];

            expect(getGroupedItems(items, groups)).toBe(items);
        });
    });

    describe('grouping with hidden items', () => {
        const groups: MenuGroup[] = [{id: 'g1', title: 'G1'}];

        it('filters hidden items with a valid groupId from group children', () => {
            const items: AsideHeaderItem[] = [
                {id: 'v', title: 'Visible', groupId: 'g1'},
                {id: 'h', title: 'Hidden', groupId: 'g1', hidden: true},
            ];

            const result = getGroupedItems(items, groups);

            expect(result).toHaveLength(1);
            const header = result[0];
            expect(isGroupHeaderItem(header)).toBe(true);
            if (isGroupHeaderItem(header)) {
                expect(header.groupChildren.map((c) => c.id)).toEqual(['v']);
            }
        });

        it('filters hidden items without a groupId from ungrouped output', () => {
            const items: AsideHeaderItem[] = [
                {id: 'top', title: 'Top'},
                {id: 'hidden-top', title: 'Hidden top', hidden: true},
                {id: 'g-child', title: 'Child', groupId: 'g1'},
            ];

            const result = getGroupedItems(items, groups);
            const ids = result.map((r) => r.id);

            expect(ids).not.toContain('hidden-top');
            expect(ids).toContain('top');
        });

        it('filters hidden items whose groupId does not match any visible group', () => {
            const items: AsideHeaderItem[] = [
                {id: 'v', title: 'V', groupId: 'g1'},
                {id: 'orphan-hidden', title: 'Orphan hidden', groupId: 'unknown', hidden: true},
                {id: 'orphan-visible', title: 'Orphan visible', groupId: 'unknown'},
            ];

            const result = getGroupedItems(items, groups);
            const ids = result.map((r) => r.id);

            expect(ids).not.toContain('orphan-hidden');
            expect(ids).toContain('orphan-visible');
        });

        it('omits a group entirely when all of its children are hidden', () => {
            const items: AsideHeaderItem[] = [
                {id: 'top', title: 'Top'},
                {id: 'h1', title: 'H1', groupId: 'g1', hidden: true},
                {id: 'h2', title: 'H2', groupId: 'g1', hidden: true},
            ];

            const result = getGroupedItems(items, groups);

            expect(result.some((r) => isGroupHeaderItem(r))).toBe(false);
            expect(result.map((r) => r.id)).toEqual(['top']);
        });

        it('places the group header at the index of its first visible child', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A'},
                {id: 'h', title: 'H', groupId: 'g1', hidden: true},
                {id: 'b', title: 'B'},
                {id: 'c', title: 'C', groupId: 'g1'},
                {id: 'd', title: 'D', groupId: 'g1'},
            ];

            const result = getGroupedItems(items, groups);

            expect(result.map((r) => r.id)).toEqual(['a', 'b', expect.stringContaining('g1')]);
        });

        it('marks group header as current if any non-hidden child is current', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A', groupId: 'g1'},
                {id: 'b', title: 'B', groupId: 'g1', current: true},
            ];

            const result = getGroupedItems(items, groups);
            const header = result.find((r) => isGroupHeaderItem(r));

            expect(header?.current).toBe(true);
        });

        it('does not propagate current from a hidden child', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A', groupId: 'g1'},
                {id: 'b', title: 'B', groupId: 'g1', current: true, hidden: true},
            ];

            const result = getGroupedItems(items, groups);
            const header = result.find((r) => isGroupHeaderItem(r));

            expect(header).toBeDefined();
            expect(header?.current).toBeFalsy();
        });
    });
});
