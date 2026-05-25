/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen} from '@testing-library/react';

import {AsideHeaderInnerContextProvider} from '../../../AsideHeaderContext';
import {AsideHeaderItem} from '../../../types';
import {AllPagesPanel} from '../AllPagesPanel';

jest.mock('../i18n', () => ({
    __esModule: true,
    default: (key: string) => key,
}));

function renderAllPagesPanel(props: {menuItems: AsideHeaderItem[]; onClosePanel: jest.Mock}) {
    const contextValue = {
        compact: false,
        size: 200,
        menuItems: props.menuItems,
        allPagesIsAvailable: true,
        onItemClick: () => {},
        onClosePanel: props.onClosePanel,
    } as any;

    return render(
        <ThemeProvider theme="light">
            <AsideHeaderInnerContextProvider value={contextValue}>
                <AllPagesPanel />
            </AsideHeaderInnerContextProvider>
        </ThemeProvider>,
    );
}

describe('AllPagesPanel', () => {
    it('should call item.onItemClick and close the panel on item click', () => {
        const onClosePanel = jest.fn();
        const dashboardOnItemClick = jest.fn();

        const menuItems: AsideHeaderItem[] = [
            {id: 'dashboard', title: 'Dashboard', icon: Gear, onItemClick: dashboardOnItemClick},
        ];

        renderAllPagesPanel({menuItems, onClosePanel});

        fireEvent.click(screen.getByText('Dashboard'));

        expect(dashboardOnItemClick).toHaveBeenCalledTimes(1);
        expect(onClosePanel).toHaveBeenCalledTimes(1);
    });
});
