/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen} from '@testing-library/react';

import {AsideHeaderContextProvider} from '../../../AsideHeaderContext';
import {FooterItem} from '../FooterItem';

jest.mock('../../../i18n');

describe('FooterItem', () => {
    it('renders standalone in compact mode with only the public AsideHeader context', () => {
        render(
            <ThemeProvider theme="light">
                <AsideHeaderContextProvider
                    value={{compact: true, size: 44, menuDensity: 'compact'}}
                >
                    <FooterItem compact id="settings" title="Settings" icon={Gear} />
                </AsideHeaderContextProvider>
            </ThemeProvider>,
        );

        expect(screen.getByRole('button', {name: 'Settings'})).toBeTruthy();
    });

    it('does not make the itemWrapper item focusable by default', () => {
        render(
            <ThemeProvider theme="light">
                <AsideHeaderContextProvider
                    value={{compact: true, size: 44, menuDensity: 'compact'}}
                >
                    <FooterItem
                        compact
                        id="settings"
                        title="Settings"
                        icon={Gear}
                        itemWrapper={(params, makeItem) => makeItem(params)}
                    />
                </AsideHeaderContextProvider>
            </ThemeProvider>,
        );

        expect(screen.getByRole('button', {name: 'Settings'}).hasAttribute('tabindex')).toBe(false);
    });

    it('becomes keyboard-focusable when tabIndex is provided via menuItemAriaProps', () => {
        render(
            <ThemeProvider theme="light">
                <AsideHeaderContextProvider
                    value={{compact: true, size: 44, menuDensity: 'compact'}}
                >
                    <FooterItem
                        compact
                        id="settings"
                        title="Settings"
                        icon={Gear}
                        menuItemAriaProps={{tabIndex: 0}}
                        itemWrapper={(params, makeItem) => makeItem(params)}
                    />
                </AsideHeaderContextProvider>
            </ThemeProvider>,
        );

        expect(screen.getByRole('button', {name: 'Settings'}).tabIndex).toBe(0);
    });

    it('activates a focusable itemWrapper item with Enter and Space', () => {
        const onItemClick = jest.fn();

        render(
            <ThemeProvider theme="light">
                <AsideHeaderContextProvider
                    value={{compact: true, size: 44, menuDensity: 'compact'}}
                >
                    <FooterItem
                        compact
                        id="settings"
                        title="Settings"
                        icon={Gear}
                        menuItemAriaProps={{tabIndex: 0}}
                        onItemClick={onItemClick}
                        itemWrapper={(params, makeItem) => makeItem(params)}
                    />
                </AsideHeaderContextProvider>
            </ThemeProvider>,
        );

        const item = screen.getByRole('button', {name: 'Settings'});
        fireEvent.keyDown(item, {key: 'Enter'});
        fireEvent.keyDown(item, {key: ' '});

        expect(onItemClick).toHaveBeenCalledTimes(2);
    });
});
