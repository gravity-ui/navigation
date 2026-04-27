import {POPUP_REGULAR_ITEM_HEIGHT} from '../../../../constants';
import {MenuGroup} from '../../../../types';
import {AsideHeaderItem} from '../../../types';
import {buildCompositeBarRows} from '../grouping';
import {
    getAutosizeCompositeBarRows,
    getItemHeight,
    getItemsHeight,
    getMoreButtonItem,
    getPopupItemHeight,
    getPopupItemsHeight,
    getReorderedItems,
    getSelectedCompositeBarRowIndex,
    makeGroupHeaderAsideItem,
} from '../utils';

describe('CompositeBar utils', () => {
    describe('getPopupItemHeight', () => {
        it('returns POPUP_REGULAR_ITEM_HEIGHT for regular items', () => {
            const item: AsideHeaderItem = {id: 'r', title: 'Regular'};
            expect(getPopupItemHeight(item)).toBe(POPUP_REGULAR_ITEM_HEIGHT);
        });

        it('matches getItemHeight for action and divider types', () => {
            const action: AsideHeaderItem = {id: 'a', title: 'Action', type: 'action'};
            const divider: AsideHeaderItem = {id: 'd', title: 'Divider', type: 'divider'};

            expect(getPopupItemHeight(action)).toBe(getItemHeight(action));
            expect(getPopupItemHeight(divider)).toBe(getItemHeight(divider));
        });
    });

    describe('getPopupItemsHeight', () => {
        it('sums getPopupItemHeight like getItemsHeight sums getItemHeight', () => {
            const items: AsideHeaderItem[] = [
                {id: 'r', title: 'Regular'},
                {id: 'a', title: 'Action', type: 'action'},
            ];

            expect(getPopupItemsHeight(items)).toBe(
                getPopupItemHeight(items[0]) + getPopupItemHeight(items[1]),
            );
            expect(getItemsHeight(items)).toBe(getItemHeight(items[0]) + getItemHeight(items[1]));
        });
    });

    describe('getReorderedItems', () => {
        it('returns the same array reference when there are no afterMoreButton items', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A'},
                {id: 'b', title: 'B'},
            ];
            expect(getReorderedItems(items)).toBe(items);
        });

        it('moves items with afterMoreButton to the end while preserving relative order', () => {
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A'},
                {id: 'action', title: 'Create', type: 'action', afterMoreButton: true},
                {id: 'b', title: 'B'},
                {id: 'c', title: 'C'},
                {id: 'action2', title: 'Create 2', type: 'action', afterMoreButton: true},
            ];

            expect(getReorderedItems(items).map((it) => it.id)).toEqual([
                'a',
                'b',
                'c',
                'action',
                'action2',
            ]);
        });
    });

    describe('group header selection', () => {
        it('makeGroupHeaderAsideItem does not set current from children', () => {
            const groups: MenuGroup[] = [{id: 'g1', title: 'G1'}];
            const header = makeGroupHeaderAsideItem(groups[0]);
            expect(header.current).toBeFalsy();
        });

        it('getSelectedCompositeBarRowIndex ignores current on group children', () => {
            const rows = buildCompositeBarRows(
                [
                    {id: 'a', title: 'A'},
                    {id: 'c', title: 'C', groupId: 'g1', current: true},
                ],
                [{id: 'g1', title: 'G1'}],
            );
            expect(getSelectedCompositeBarRowIndex(rows)).toBeUndefined();
        });
    });

    describe('getAutosizeCompositeBarRows', () => {
        it('moves a whole group into overflow as one synthetic row with popup children', () => {
            const groups: MenuGroup[] = [{id: 'g1', title: 'G1'}];
            const items: AsideHeaderItem[] = [
                {id: 'a', title: 'A'},
                {id: 'c1', title: 'C1', groupId: 'g1'},
            ];
            const rows = buildCompositeBarRows(items, groups);
            const collapseItem = getMoreButtonItem('More');

            const {collapseItems} = getAutosizeCompositeBarRows(rows, 1, collapseItem);

            const overflowGroup = collapseItems.find((i) => i.compositeBarMenuPopupItems?.length);
            expect(overflowGroup?.compositeBarMenuPopupItems?.map((c) => c.id)).toEqual(['c1']);
        });
    });
});
