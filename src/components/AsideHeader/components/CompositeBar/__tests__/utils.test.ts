import {POPUP_REGULAR_ITEM_HEIGHT} from '../../../../constants';
import {AsideHeaderItem} from '../../../types';
import {getItemHeight, getItemsHeight, getPopupItemHeight, getPopupItemsHeight} from '../utils';

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
});
