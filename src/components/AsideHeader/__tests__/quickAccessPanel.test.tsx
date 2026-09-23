/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen, within} from '@testing-library/react';

import {MenuGroup} from '../../types';
import {AsideHeaderInnerContextProvider, AsideHeaderInnerContextType} from '../AsideHeaderContext';
import {CompositeBar} from '../components/CompositeBar/CompositeBar';
import {AsideHeaderItem} from '../types';

jest.mock('../i18n');

jest.mock('react-virtualized-auto-sizer', () => ({
    __esModule: true,
    default: ({children}: {children: (size: {width: number; height: number}) => React.ReactNode}) =>
        children({width: 240, height: 400}),
}));

const baseContextValue: AsideHeaderInnerContextType = {
    compact: false,
    size: 240,
    menuDensity: 'default',
    menuItems: [],
    allPagesIsAvailable: false,
    quickAccessIsAvailable: true,
    onItemClick: () => {},
    onToggleQuickAccess: () => {},
};

function renderBar({
    items,
    compact = false,
    menuGroups,
    onItemClick = jest.fn(),
    onToggleQuickAccess = jest.fn(),
    suppressCurrentItemIds,
}: {
    items: AsideHeaderItem[];
    compact?: boolean;
    menuGroups?: MenuGroup[];
    onItemClick?: jest.Mock;
    onToggleQuickAccess?: jest.Mock;
    suppressCurrentItemIds?: ReadonlySet<string>;
}) {
    return render(
        <ThemeProvider theme="light">
            <AsideHeaderInnerContextProvider
                value={{
                    ...baseContextValue,
                    compact,
                    menuItems: items,
                    onItemClick,
                    onToggleQuickAccess,
                }}
            >
                <CompositeBar
                    type="menu"
                    items={items}
                    menuGroups={menuGroups}
                    compact={compact}
                    onItemClick={onItemClick}
                    enableQuickAccessPin
                    onToggleQuickAccess={onToggleQuickAccess}
                    suppressCurrentItemIds={suppressCurrentItemIds}
                />
            </AsideHeaderInnerContextProvider>
        </ThemeProvider>,
    );
}

describe('CompositeBar quick access controls', () => {
    it('passes the original item without activating the menu row', () => {
        const menuItem: AsideHeaderItem = {id: 'settings', title: 'Settings', icon: Gear};
        const onItemClick = jest.fn();
        const onToggleQuickAccess = jest.fn();

        const {container} = renderBar({items: [menuItem], onItemClick, onToggleQuickAccess});

        fireEvent.click(screen.getByRole('button', {name: 'Pin to quick access'}));

        expect(onToggleQuickAccess).toHaveBeenCalledWith(menuItem, expect.anything());
        expect(onItemClick).not.toHaveBeenCalled();
        // Pin is a sibling of the row control, never an invalid nested button.
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        expect(container.querySelector('button button')).toBeNull();
    });

    it('keeps a compact group popup open after pinning its child', () => {
        const child: AsideHeaderItem = {
            id: 'workbook',
            title: 'Workbook',
            icon: Gear,
            groupId: 'resources',
        };
        const onItemClick = jest.fn();
        const onToggleQuickAccess = jest.fn();

        renderBar({
            items: [child],
            compact: true,
            menuGroups: [{id: 'resources', title: 'Resources', icon: Gear}],
            onItemClick,
            onToggleQuickAccess,
        });

        fireEvent.click(screen.getByRole('button', {name: 'Resources'}));
        onItemClick.mockClear();
        fireEvent.click(screen.getByRole('button', {name: 'Pin to quick access'}));

        expect(onToggleQuickAccess).toHaveBeenCalledWith(child, expect.anything());
        expect(onItemClick).not.toHaveBeenCalled();
        expect(screen.getByRole('button', {name: 'Workbook'})).toBeTruthy();
    });

    it('suppresses the aggregate current state of a compact group', () => {
        const child: AsideHeaderItem = {
            id: 'workbook',
            title: 'Workbook',
            icon: Gear,
            groupId: 'resources',
            current: true,
            quickAccess: true,
        };

        renderBar({
            items: [child],
            compact: true,
            menuGroups: [{id: 'resources', title: 'Resources', icon: Gear}],
            suppressCurrentItemIds: new Set([child.id]),
        });

        const groupButton = screen.getByRole('button', {name: 'Resources'});
        expect(groupButton.className).not.toContain('current');

        fireEvent.click(groupButton);
        expect(screen.getByRole('button', {name: 'Workbook'}).className).not.toContain('current');
    });

    it('suppresses only the duplicate highlight and preserves the public item', () => {
        const menuItem: AsideHeaderItem = {
            id: 'settings',
            title: 'Settings',
            icon: Gear,
            current: true,
            quickAccess: true,
        };
        const onItemClick = jest.fn();

        renderBar({
            items: [menuItem],
            onItemClick,
            suppressCurrentItemIds: new Set([menuItem.id]),
        });

        const row = screen.getByRole('button', {name: 'Settings'});
        expect(row.className).not.toContain('current');

        fireEvent.click(row);

        expect(onItemClick).toHaveBeenCalledWith(
            expect.objectContaining({id: menuItem.id, current: true, quickAccess: true}),
            false,
            expect.anything(),
        );
        expect(menuItem.current).toBe(true);
    });

    it('does not offer quick access for action items', () => {
        renderBar({
            items: [{id: 'create', title: 'Create', icon: Gear, type: 'action'}],
        });

        expect(screen.queryByRole('button', {name: 'Pin to quick access'})).toBeNull();
    });

    it('can preserve the current highlight in both sections', () => {
        renderBar({
            items: [
                {
                    id: 'settings',
                    title: 'Settings',
                    icon: Gear,
                    current: true,
                    quickAccess: true,
                },
            ],
        });

        expect(screen.getByRole('button', {name: 'Settings'}).className).toContain('current');
        expect(screen.getByRole('button', {name: 'Remove from quick access'})).toBeTruthy();
    });

    it('renders the pin outside an anchor itemWrapper', () => {
        const onItemClick = jest.fn();
        const onToggleQuickAccess = jest.fn();
        const menuItem: AsideHeaderItem = {
            id: 'settings',
            title: 'Settings',
            icon: Gear,
            itemWrapper: (params, makeItem) => <a href="#settings-wrapper">{makeItem(params)}</a>,
        };

        renderBar({items: [menuItem], onItemClick, onToggleQuickAccess});
        const anchor = screen.getByRole('link', {name: 'Settings'});
        const pin = screen.getByRole('button', {name: 'Pin to quick access'});

        expect(within(anchor).queryByRole('button', {name: 'Pin to quick access'})).toBeNull();
        fireEvent.click(pin);
        expect(onToggleQuickAccess).toHaveBeenCalledWith(menuItem, expect.anything());
        expect(onItemClick).not.toHaveBeenCalled();
    });
});
