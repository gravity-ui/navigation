/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen} from '@testing-library/react';

import {MenuGroup} from '../../../../types';
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
    menuGroups?: MenuGroup[];
}) {
    return render(
        <ThemeProvider theme="light">
            <AsideHeaderInnerContextProvider value={contextValue}>
                <CompositeBar
                    type="menu"
                    items={props.items}
                    menuGroups={props.menuGroups}
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

    it('renders MenuGroup.popupTitle as the heading of the group popup', () => {
        const onItemClick = jest.fn();
        const items: AsideHeaderItem[] = [
            {id: 'wb-1', title: 'Workbook 1', icon: Gear, groupId: 'resources'},
            {id: 'wb-2', title: 'Workbook 2', icon: Gear, groupId: 'resources'},
        ];
        const menuGroups: MenuGroup[] = [
            {id: 'resources', title: 'Resources Group', popupTitle: 'Ресурсы', icon: Gear},
        ];

        renderCompositeBar({items, onItemClick, menuGroups});

        // Expand the group header to open the popup
        const groupHeader = screen.getByText('Resources Group');
        fireEvent.click(groupHeader);

        expect(screen.getByText('Ресурсы')).toBeTruthy();
    });

    it('does not render popupTitle when it is not set on the MenuGroup', () => {
        const onItemClick = jest.fn();
        const items: AsideHeaderItem[] = [
            {id: 'wb-1', title: 'Workbook 1', icon: Gear, groupId: 'resources'},
        ];
        const menuGroups: MenuGroup[] = [{id: 'resources', title: 'Resources Group', icon: Gear}];

        renderCompositeBar({items, onItemClick, menuGroups});

        const groupHeader = screen.getByText('Resources Group');
        fireEvent.click(groupHeader);

        // eslint-disable-next-line testing-library/no-node-access
        expect(document.querySelector('.gn-composite-bar-item__popup-title')).toBeNull();
    });
});
