import {Gear} from '@gravity-ui/icons';

import type {MenuGroup} from '../../../../types';
import type {AsideHeaderItem} from '../../../types';
import {buildCompositeBarRows} from '../../CompositeBar/grouping';
import {
    ALL_PAGES_PANEL_ROW_BUILD_OPTIONS,
    getAllPagesEditModeFlatItems,
    getAllPagesViewModeFlatItems,
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

    it('getAllPagesEditModeFlatItems keeps MenuGroup.hidden groups as header rows', () => {
        const mixed: MenuGroup[] = [
            {id: 'analytics', title: 'Analytics', icon: Gear, hidden: true},
            {id: 'settings', title: 'Settings', icon: Gear},
        ];
        const flat = getAllPagesEditModeFlatItems(items, mixed);
        expect(flat.some((r) => r.id.includes('analytics'))).toBe(true);
    });

    it('getAllPagesViewModeFlatItems returns items unchanged when no group has its own action', () => {
        expect(getAllPagesViewModeFlatItems(items, groups)).toEqual(items);
        expect(getAllPagesViewModeFlatItems(items, undefined)).toEqual(items);
    });

    it('getAllPagesViewModeFlatItems inserts a clickable header before the first group item', () => {
        const groupClick = jest.fn();
        const clickableGroups: MenuGroup[] = [
            {id: 'analytics', title: 'Analytics', icon: Gear, href: '/a', onItemClick: groupClick},
            {id: 'settings', title: 'Settings', icon: Gear},
        ];

        const flat = getAllPagesViewModeFlatItems(items, clickableGroups);

        expect(flat.map((i) => i.id)).toEqual([
            'home',
            '__gn-composite-bar__group-header__analytics',
            'o1',
            'o2',
            's1',
            'help',
        ]);

        const header = flat[1];
        expect(header.category).toBe('Analytics');
        expect(header.href).toBe('/a');
        expect(header.onItemClick).toBe(groupClick);
    });

    it('getAllPagesViewModeFlatItems appends actionable groups that have no child item', () => {
        const groupClick = jest.fn();
        const clickableGroups: MenuGroup[] = [
            {id: 'empty', title: 'Empty', icon: Gear, href: '/e', onItemClick: groupClick},
        ];

        const flat = getAllPagesViewModeFlatItems(items, clickableGroups);

        expect(flat.map((i) => i.id)).toEqual([
            'home',
            'o1',
            'o2',
            's1',
            'help',
            '__gn-composite-bar__group-header__empty',
        ]);

        const header = flat[flat.length - 1];
        expect(header.category).toBeUndefined();
        expect(header.href).toBe('/e');
        expect(header.onItemClick).toBe(groupClick);
    });

    it('getAllPagesViewModeFlatItems keeps the header in the default section when items have no category', () => {
        const noCategoryItems: AsideHeaderItem[] = [
            {id: 'o1', title: 'Overview', icon: Gear, groupId: 'analytics'},
        ];
        const clickableGroups: MenuGroup[] = [
            {id: 'analytics', title: 'Analytics', icon: Gear, href: '/a'},
        ];

        const flat = getAllPagesViewModeFlatItems(noCategoryItems, clickableGroups);

        expect(flat[0].category).toBeUndefined();
    });

    it('isCompositeBarGroupHeaderItem detects synthetic header ids', () => {
        expect(
            isCompositeBarGroupHeaderItem({
                id: '__gn-composite-bar__group-header__analytics',
                title: 'Analytics',
            } as AsideHeaderItem),
        ).toBe(true);
    });

    it('rowsToAllPagesDisplayItems sets preventUserRemoving when group pins disabled', () => {
        const rows = buildCompositeBarRows(items, groups, ALL_PAGES_PANEL_ROW_BUILD_OPTIONS);
        const display = rowsToAllPagesDisplayItems(rows);
        expect(
            display.find((i) => i.id.startsWith('__gn-composite-bar__group-header__'))
                ?.preventUserRemoving,
        ).toBe(true);
    });

    it('rowsToAllPagesDisplayItems maps MenuGroup.hidden to item.hidden and enables pins', () => {
        const rows = buildCompositeBarRows(items, groups, ALL_PAGES_PANEL_ROW_BUILD_OPTIONS);
        const display = rowsToAllPagesDisplayItems(rows, {enableGroupHeaderPins: true});
        const header = display.find((i) => i.id.startsWith('__gn-composite-bar__group-header__'));
        expect(header?.preventUserRemoving).toBe(false);
        expect(header?.hidden).toBe(false);
    });
});
