/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen} from '@testing-library/react';

import {MenuGroup} from '../../types';
import {AsideHeaderInnerContextProvider} from '../AsideHeaderContext';
import {CompositeBar} from '../components/CompositeBar/CompositeBar';
import {AsideHeaderItem} from '../types';

jest.mock('react-virtualized-auto-sizer', () => ({
    __esModule: true,
    default: ({children}: {children: (size: {width: number; height: number}) => React.ReactNode}) =>
        children({width: 240, height: 400}),
}));

const baseContextValue = {
    compact: false,
    size: 240,
    menuDensity: 'default' as const,
    menuItems: [] as AsideHeaderItem[],
    allPagesIsAvailable: false,
    quickAccessIsAvailable: true,
    onItemClick: jest.fn(),
    onToggleQuickAccess: jest.fn(),
    enableQuickAccess: true,
};

function renderQuickAccessBar(
    items: AsideHeaderItem[],
    onToggleQuickAccess = jest.fn(),
    extraProps: Partial<React.ComponentProps<typeof CompositeBar>> = {},
) {
    return render(
        <ThemeProvider theme="light">
            <AsideHeaderInnerContextProvider
                value={{
                    ...baseContextValue,
                    menuItems: items,
                    onToggleQuickAccess,
                    onMenuItemsChanged: jest.fn(),
                }}
            >
                <CompositeBar
                    type="menu"
                    items={items}
                    compact={false}
                    onItemClick={jest.fn()}
                    enableQuickAccessPin
                    onToggleQuickAccess={onToggleQuickAccess}
                    {...extraProps}
                />
            </AsideHeaderInnerContextProvider>
        </ThemeProvider>,
    );
}

describe('CompositeBar quick access pin', () => {
    it('calls onToggleQuickAccess when pin button is clicked', () => {
        const onToggleQuickAccess = jest.fn();
        const items: AsideHeaderItem[] = [{id: 'settings', title: 'Settings', icon: Gear}];

        renderQuickAccessBar(items, onToggleQuickAccess);

        fireEvent.click(screen.getByLabelText('Pin to quick access'));

        expect(onToggleQuickAccess).toHaveBeenCalledWith(expect.objectContaining({id: 'settings'}));
    });

    it('does not render pin button in compact mode', () => {
        renderQuickAccessBar([{id: 'settings', title: 'Settings', icon: Gear}], jest.fn(), {
            compact: true,
        });

        expect(screen.queryByLabelText('Pin to quick access')).toBeNull();
    });

    it('calls onToggleQuickAccess when pin button is clicked in compact group popup', () => {
        const onToggleQuickAccess = jest.fn();
        const items: AsideHeaderItem[] = [
            {id: 'wb-1', title: 'Workbook 1', icon: Gear, groupId: 'resources'},
        ];
        const menuGroups: MenuGroup[] = [
            {id: 'resources', title: 'Resources Group', popupTitle: 'Resources', icon: Gear},
        ];

        renderQuickAccessBar(items, onToggleQuickAccess, {
            compact: true,
            menuGroups,
        });

        fireEvent.click(screen.getByText('Resources Group'));

        fireEvent.mouseEnter(screen.getByRole('button', {name: 'Workbook 1'}));

        fireEvent.click(screen.getByLabelText('Pin to quick access'));

        expect(onToggleQuickAccess).toHaveBeenCalledWith(expect.objectContaining({id: 'wb-1'}));
    });
});
