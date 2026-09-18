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

function renderPanel({items, onClosePanel}: {items: AsideHeaderItem[]; onClosePanel: jest.Mock}) {
    const contextValue = {
        compact: false,
        size: 236,
        allPagesIsAvailable: true,
        quickAccessIsAvailable: false,
        menuItems: items,
        onItemClick: () => {},
        onToggleQuickAccess: () => {},
        onMenuItemsChanged: jest.fn(),
        onClosePanel,
    } as never;

    return render(
        <ThemeProvider theme="light">
            <AsideHeaderInnerContextProvider value={contextValue}>
                <AllPagesPanel />
            </AsideHeaderInnerContextProvider>
        </ThemeProvider>,
    );
}

describe('AllPagesPanel item click', () => {
    it('closes the panel and fires the item action on a non-current item click', () => {
        const onClosePanel = jest.fn();
        const itemClick = jest.fn();

        renderPanel({
            items: [{id: 'home', title: 'Home', icon: Gear, onItemClick: itemClick}],
            onClosePanel,
        });

        fireEvent.click(screen.getByText('Home'));

        expect(itemClick).toHaveBeenCalledTimes(1);
        expect(onClosePanel).toHaveBeenCalledTimes(1);
        // The panel closes before the item action, so an action that opens
        // another panel is not clobbered by this close (sidebar handler parity).
        expect(onClosePanel.mock.invocationCallOrder[0]).toBeLessThan(
            itemClick.mock.invocationCallOrder[0],
        );
    });

    it('keeps the panel open when clicking the current item', () => {
        const onClosePanel = jest.fn();

        renderPanel({
            items: [{id: 'home', title: 'Home', icon: Gear, current: true}],
            onClosePanel,
        });

        fireEvent.click(screen.getByText('Home'));

        expect(onClosePanel).not.toHaveBeenCalled();
    });
});
