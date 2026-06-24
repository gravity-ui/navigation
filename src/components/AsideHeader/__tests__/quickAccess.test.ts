import {Gear} from '@gravity-ui/icons';

import {COLLAPSE_ITEM_ID} from '../components/CompositeBar/constants';
import {
    getMainMenuItemsForDisplay,
    isQuickAccessMenuItem,
    isQuickAccessPinEligible,
} from '../quickAccess';
import {ALL_PAGES_ID, AsideHeaderItem} from '../types';

describe('quickAccess', () => {
    describe('isQuickAccessPinEligible', () => {
        it('returns true for regular leaf menu items', () => {
            expect(isQuickAccessPinEligible({id: 'home', type: 'regular'})).toBe(true);
        });

        it('returns false for dividers, actions, and synthetic rows', () => {
            expect(isQuickAccessPinEligible({id: 'd1', type: 'divider'})).toBe(false);
            expect(isQuickAccessPinEligible({id: 'a1', type: 'action'})).toBe(false);
            expect(isQuickAccessPinEligible({id: COLLAPSE_ITEM_ID, type: 'regular'})).toBe(false);
            expect(isQuickAccessPinEligible({id: ALL_PAGES_ID, type: 'regular'})).toBe(false);
            expect(
                isQuickAccessPinEligible({
                    id: 'group',
                    type: 'regular',
                    compositeBarMenuPopupItems: [{id: 'child', title: 'Child'}],
                }),
            ).toBe(false);
            expect(
                isQuickAccessPinEligible({
                    id: 'group-header',
                    type: 'regular',
                    groupHeaderExpanded: false,
                }),
            ).toBe(false);
        });
    });

    describe('isQuickAccessMenuItem', () => {
        it('requires quickAccess flag and leaf eligibility', () => {
            const item: AsideHeaderItem = {
                id: 'home',
                title: 'Home',
                icon: Gear,
                quickAccess: true,
            };

            expect(isQuickAccessMenuItem(item)).toBe(true);
            expect(isQuickAccessMenuItem({...item, quickAccess: false})).toBe(false);
            expect(isQuickAccessMenuItem({...item, type: 'divider'})).toBe(false);
        });
    });

    describe('getMainMenuItemsForDisplay', () => {
        it('clears current on items that are also shown in quick access', () => {
            const home: AsideHeaderItem = {
                id: 'home',
                title: 'Home',
                icon: Gear,
                quickAccess: true,
                current: true,
            };
            const settings: AsideHeaderItem = {
                id: 'settings',
                title: 'Settings',
                icon: Gear,
                current: false,
            };

            const visible = [home, settings];
            const quickAccess = [home];

            expect(getMainMenuItemsForDisplay(visible, quickAccess)).toEqual([
                {...home, current: false},
                settings,
            ]);
        });

        it('returns visible items unchanged when quick access is empty', () => {
            const items: AsideHeaderItem[] = [
                {id: 'home', title: 'Home', icon: Gear, current: true},
            ];

            expect(getMainMenuItemsForDisplay(items, [])).toBe(items);
        });
    });
});
