/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen} from '@testing-library/react';

import {AsideHeaderInnerContextProvider} from '../../../AsideHeaderContext';
import {AsideHeaderItem} from '../../../types';
import {CompositeBar} from '../CompositeBar';

// Mock AutoSizer to render children with a fixed small height that forces items to collapse
jest.mock('react-virtualized-auto-sizer', () => ({
    __esModule: true,
    default: ({children}: {children: (size: {width: number; height: number}) => React.ReactNode}) =>
        children({width: 200, height: 80}),
}));

const contextValue = {
    compact: false,
    size: 200,
    menuItems: [],
    allPagesIsAvailable: false,
    onItemClick: () => {},
} as any;

function renderCompositeBar(props: {
    items: AsideHeaderItem[];
    onItemClick: jest.Mock;
    compact?: boolean;
    menuMoreTitle?: string;
}) {
    return render(
        <ThemeProvider theme="light">
            <AsideHeaderInnerContextProvider value={contextValue}>
                <CompositeBar
                    type="menu"
                    items={props.items}
                    compact={props.compact ?? false}
                    onItemClick={props.onItemClick}
                    menuMoreTitle={props.menuMoreTitle ?? 'More'}
                />
            </AsideHeaderInnerContextProvider>
        </ThemeProvider>,
    );
}

describe('CompositeBar', () => {
    it('should preserve item.onItemClick when clicking collapsed popup items', () => {
        const onItemClick = jest.fn();
        const dashboardOnItemClick = jest.fn();

        const items: AsideHeaderItem[] = [
            {id: 'item1', title: 'Item 1', icon: Gear},
            {id: 'item2', title: 'Item 2', icon: Gear},
            {id: 'dashboard', title: 'Dashboard', icon: Gear, onItemClick: dashboardOnItemClick},
        ];

        // With height=80 and ITEM_HEIGHT=40, only item1 + collapse button fit.
        // item2 and dashboard go into the collapsed popup.
        renderCompositeBar({items, onItemClick});

        // Click the "More" button to open the collapsed popup
        const moreButton = screen.getByText('More');
        fireEvent.click(moreButton);

        // Click "Dashboard" in the collapsed popup
        const dashboardPopupItem = screen.getByText('Dashboard');
        fireEvent.click(dashboardPopupItem);

        // The onItemClick callback should receive the item with its original onItemClick preserved
        expect(onItemClick).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'dashboard',
                onItemClick: dashboardOnItemClick,
            }),
            true,
            expect.any(Object),
        );
    });
});
