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
import i18n from '../i18n';

function renderPanel({
    items,
    onClosePanel,
    onMenuItemsChanged = jest.fn(),
}: {
    items: AsideHeaderItem[];
    onClosePanel: jest.Mock;
    onMenuItemsChanged?: jest.Mock;
}) {
    const contextValue = {
        compact: false,
        size: 236,
        allPagesIsAvailable: true,
        quickAccessIsAvailable: false,
        menuItems: items,
        onItemClick: () => {},
        onToggleQuickAccess: () => {},
        onMenuItemsChanged,
        onClosePanel,
    } as never;

    return render(
        <ThemeProvider theme="light">
            <AsideHeaderInnerContextProvider value={contextValue}>
                <AllPagesPanel startEditIcon={<span>Configure menu</span>} />
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

describe.each([undefined, '#home'])('AllPagesPanel editing with href=%s', (href) => {
    it('renders the pin button without an interactive ancestor', () => {
        renderPanel({
            items: [{id: 'home', title: 'Home', icon: Gear, href}],
            onClosePanel: jest.fn(),
        });

        fireEvent.click(screen.getByRole('button', {name: 'Configure menu'}));

        const pin = screen.getByRole('button', {name: i18n('all-panel.item.unpin')});
        // The ancestor structure is the accessibility regression under test.
        // eslint-disable-next-line testing-library/no-node-access
        expect(pin.parentElement?.closest('a, button')).toBeNull();
    });

    it('suppresses item actions while editing and restores them afterwards', () => {
        const onClosePanel = jest.fn();
        const itemClick = jest.fn();
        const onMenuItemsChanged = jest.fn();
        const item = {id: 'home', title: 'Home', icon: Gear, href, onItemClick: itemClick};

        renderPanel({items: [item], onClosePanel, onMenuItemsChanged});

        const configure = screen.getByRole('button', {name: 'Configure menu'});
        fireEvent.click(configure);

        const pin = screen.getByRole('button', {name: i18n('all-panel.item.unpin')});
        // List only dispatches Enter for an active item; hovering activates the row.
        fireEvent.mouseEnter(screen.getByText('Home'));
        fireEvent.focus(pin);
        fireEvent.keyDown(pin, {key: 'Enter', code: 'Enter'});

        expect(itemClick).not.toHaveBeenCalled();
        expect(onClosePanel).not.toHaveBeenCalled();

        // jsdom does not synthesize the native button click from keydown.
        fireEvent.click(pin);

        expect(onMenuItemsChanged).toHaveBeenCalledTimes(1);
        expect(onMenuItemsChanged).toHaveBeenCalledWith([{...item, hidden: true}]);
        expect(itemClick).not.toHaveBeenCalled();
        expect(onClosePanel).not.toHaveBeenCalled();

        fireEvent.click(configure);
        const navigation = screen.getByRole(href ? 'link' : 'button', {name: 'Home'});
        fireEvent.click(navigation);

        expect(itemClick).toHaveBeenCalledTimes(1);
        expect(onClosePanel).toHaveBeenCalledTimes(1);
    });
});
