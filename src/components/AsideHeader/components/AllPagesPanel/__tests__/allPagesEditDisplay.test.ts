import {Gear} from '@gravity-ui/icons';

import type {MenuGroup} from '../../../../types';
import type {AsideHeaderItem} from '../../../types';
import {buildCompositeBarRows} from '../../CompositeBar/grouping';
import {
    getAllPagesEditModeFlatItems,
    isCompositeBarGroupHeaderItem,
    rowsToAllPagesDisplayItems,
} from '../allPagesEditDisplay';

describe('allPagesEditDisplay', () => {
    const groups: MenuGroup[] = [
        {id: 'analytics', title: 'Analytics', icon: Gear},
        {id: 'settings', title: 'Settings', icon: Gear},
    ];

    const items: AsideHeaderItem[] = [
        {id: 'home', title: 'Home', icon: Gear, category: 'General'},
        {id: 'o1', title: 'Overview', icon: Gear, groupId: 'analytics', category: 'Analytics'},
        {
            id: 'o2',
            title: 'Reports',
            icon: Gear,
            groupId: 'analytics',
            category: 'Analytics',
        },
        {id: 's1', title: 'General', icon: Gear, groupId: 'settings', category: 'Settings'},
        {id: 'help', title: 'Help', icon: Gear, category: 'General'},
    ];

    it('getAllPagesEditModeFlatItems includes group headers and excludes group children', () => {
        const flat = getAllPagesEditModeFlatItems(items, groups);
        expect(flat.map((i) => i.id)).toEqual([
            'home',
            '__gn-composite-bar__group-header__analytics',
            '__gn-composite-bar__group-header__settings',
            'help',
        ]);
    });

    it('isCompositeBarGroupHeaderItem detects synthetic header ids', () => {
        expect(
            isCompositeBarGroupHeaderItem({
                id: '__gn-composite-bar__group-header__analytics',
                title: 'Analytics',
            } as AsideHeaderItem),
        ).toBe(true);
    });

    it('rowsToAllPagesDisplayItems sets preventUserRemoving on headers', () => {
        const rows = buildCompositeBarRows(items, groups);
        const display = rowsToAllPagesDisplayItems(rows);
        expect(
            display.find((i) => i.id.startsWith('__gn-composite-bar__group-header__'))
                ?.preventUserRemoving,
        ).toBe(true);
    });
});
