import {Gear} from '@gravity-ui/icons';

import {COLLAPSE_ITEM_ID} from '../components/CompositeBar/constants';
import {
    getQuickAccessMenuItems,
    isQuickAccessMenuItem,
    isQuickAccessPinEligible,
} from '../quickAccess';
import {ALL_PAGES_ID, AsideHeaderItem} from '../types';

describe('quick access selectors', () => {
    it('allows only visible regular leaf items', () => {
        expect(isQuickAccessPinEligible({id: 'home', type: 'regular'})).toBe(true);
        expect(isQuickAccessPinEligible({id: 'implicit-regular'})).toBe(true);
        expect(isQuickAccessPinEligible({id: 'hidden', hidden: true})).toBe(false);
        expect(isQuickAccessPinEligible({id: 'divider', type: 'divider'})).toBe(false);
        expect(isQuickAccessPinEligible({id: 'action', type: 'action'})).toBe(false);
        expect(isQuickAccessPinEligible({id: COLLAPSE_ITEM_ID})).toBe(false);
        expect(isQuickAccessPinEligible({id: ALL_PAGES_ID})).toBe(false);
        expect(
            isQuickAccessPinEligible({
                id: 'popup-parent',
                compositeBarMenuPopupItems: [{id: 'child', title: 'Child'}],
            }),
        ).toBe(false);
        expect(isQuickAccessPinEligible({id: 'group-header', groupHeaderExpanded: false})).toBe(
            false,
        );
    });

    it('requires quickAccess and keeps the source item unchanged', () => {
        const item: AsideHeaderItem = {
            id: 'home',
            title: 'Home',
            icon: Gear,
            current: true,
            quickAccess: true,
        };

        expect(isQuickAccessMenuItem(item)).toBe(true);
        expect(isQuickAccessMenuItem({...item, quickAccess: false})).toBe(false);
        expect(item).toEqual(expect.objectContaining({current: true, quickAccess: true}));
    });

    it('preserves source order and omits hidden items and hidden groups', () => {
        const items: AsideHeaderItem[] = [
            {id: 'first', title: 'First', quickAccess: true},
            {id: 'hidden', title: 'Hidden', hidden: true, quickAccess: true},
            {id: 'group-child', title: 'Group child', groupId: 'hidden-group', quickAccess: true},
            {id: 'last', title: 'Last', quickAccess: true},
        ];

        expect(
            getQuickAccessMenuItems(items, [{id: 'hidden-group', title: 'Hidden', hidden: true}]),
        ).toEqual([items[0], items[3]]);
    });
});
