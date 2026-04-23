import {MenuGroup} from '../../../../types';
import {AsideHeaderItem} from '../../../types';
import {buildCompositeBarRows} from '../grouping';

describe('buildCompositeBarRows', () => {
    describe('pass-through paths (no grouping applied)', () => {
        it('returns items as rows when groups is undefined', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A'},
                {id: 'b', title: 'B', hidden: true},
            ];

            expect(buildCompositeBarRows(items, undefined)).toEqual([
                {kind: 'item', item: items[0]},
                {kind: 'item', item: items[1]},
            ]);
        });

        it('returns items as rows when groups is empty', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A'},
                {id: 'b', title: 'B', hidden: true},
            ];

            expect(buildCompositeBarRows(items, [])).toEqual([
                {kind: 'item', item: items[0]},
                {kind: 'item', item: items[1]},
            ]);
        });

        it('returns items as-is when all provided groups are hidden', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A'},
                {id: 'b', title: 'B', hidden: true},
            ];
            const groups: MenuGroup[] = [{id: 'g1', title: 'G1', hidden: true}];

            expect(buildCompositeBarRows(items, groups)).toEqual([
                {kind: 'item', item: items[0]},
                {kind: 'item', item: items[1]},
            ]);
        });
    });

    describe('grouping with hidden items', () => {
        const groups: MenuGroup[] = [{id: 'g1', title: 'G1'}];

        it('filters hidden items with a valid groupId from group children', () => {
            const items: AsideHeaderItem[] = [
                {id: 'v', title: 'Visible', groupId: 'g1'},
                {id: 'h', title: 'Hidden', groupId: 'g1', hidden: true},
            ];

            const result = buildCompositeBarRows(items, groups);

            expect(result).toHaveLength(1);
            const row = result[0];
            expect(row).toEqual({
                kind: 'group',
                group: groups[0],
                items: [{id: 'v', title: 'Visible', groupId: 'g1'}],
            });
        });

        it('filters hidden items without a groupId from ungrouped output', () => {
            const items: AsideHeaderItem[] = [
                {id: 'top', title: 'Top'},
                {id: 'hidden-top', title: 'Hidden top', hidden: true},
                {id: 'g-child', title: 'Child', groupId: 'g1'},
            ];

            const result = buildCompositeBarRows(items, groups);
            const ids = result.flatMap((r) =>
                r.kind === 'item' ? [r.item.id] : r.items.map((c) => c.id),
            );

            expect(ids).not.toContain('hidden-top');
            expect(ids).toContain('top');
        });

        it('filters hidden items whose groupId does not match any visible group', () => {
            const items: AsideHeaderItem[] = [
                {id: 'v', title: 'V', groupId: 'g1'},
                {id: 'orphan-hidden', title: 'Orphan hidden', groupId: 'unknown', hidden: true},
                {id: 'orphan-visible', title: 'Orphan visible', groupId: 'unknown'},
            ];

            const result = buildCompositeBarRows(items, groups);
            const ids = result.flatMap((r) =>
                r.kind === 'item' ? [r.item.id] : [r.group.id, ...r.items.map((c) => c.id)],
            );

            expect(ids).not.toContain('orphan-hidden');
            expect(ids).toContain('orphan-visible');
        });

        it('omits a group entirely when all of its children are hidden', () => {
            const items: AsideHeaderItem[] = [
                {id: 'top', title: 'Top'},
                {id: 'h1', title: 'H1', groupId: 'g1', hidden: true},
                {id: 'h2', title: 'H2', groupId: 'g1', hidden: true},
            ];

            const result = buildCompositeBarRows(items, groups);

            expect(result.some((r) => r.kind === 'group')).toBe(false);
            expect(
                result
                    .filter((r): r is Extract<typeof r, {kind: 'item'}> => r.kind === 'item')
                    .map((r) => r.item.id),
            ).toEqual(['top']);
        });

        it('places the group header at the index of its first visible child', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A'},
                {id: 'h', title: 'H', groupId: 'g1', hidden: true},
                {id: 'b', title: 'B'},
                {id: 'c', title: 'C', groupId: 'g1'},
                {id: 'd', title: 'D', groupId: 'g1'},
            ];

            const result = buildCompositeBarRows(items, groups);

            expect(
                result.map((r) =>
                    r.kind === 'item' ? r.item.id : `group:${r.group.id}:${r.items[0]?.id}`,
                ),
            ).toEqual(['a', 'b', 'group:g1:c']);
        });

        it('marks group header row as having current child if any non-hidden child is current', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A', groupId: 'g1'},
                {id: 'b', title: 'B', groupId: 'g1', current: true},
            ];

            const result = buildCompositeBarRows(items, groups);
            const groupRow = result.find((r) => r.kind === 'group');

            expect(groupRow?.kind === 'group' && groupRow.items.some((c) => c.current)).toBe(true);
        });

        it('does not propagate current from a hidden child', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A', groupId: 'g1'},
                {id: 'b', title: 'B', groupId: 'g1', current: true, hidden: true},
            ];

            const result = buildCompositeBarRows(items, groups);
            const groupRow = result.find((r) => r.kind === 'group');

            expect(groupRow?.kind === 'group').toBe(true);
            if (groupRow?.kind === 'group') {
                expect(groupRow.items.some((c) => Boolean(c.current))).toBe(false);
            }
        });
    });
});
