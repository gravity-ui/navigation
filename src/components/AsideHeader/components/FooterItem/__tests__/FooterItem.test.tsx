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

const renderWrappedItem = (props?: Partial<React.ComponentProps<typeof FooterItem>>) =>
    render(
        <ThemeProvider theme="light">
            <AsideHeaderContextProvider value={{compact: true, size: 44, menuDensity: 'compact'}}>
                <FooterItem
                    compact
                    id="settings"
                    title="Settings"
                    icon={Gear}
                    itemWrapper={(params, makeItem) => makeItem(params)}
                    {...props}
                />
            </AsideHeaderContextProvider>
        </ThemeProvider>,
    );

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
        renderWrappedItem();

        expect(screen.getByRole('button', {name: 'Settings'}).hasAttribute('tabindex')).toBe(false);
    });

    it('becomes keyboard-focusable when tabIndex is provided via menuItemAriaProps', () => {
        renderWrappedItem({menuItemAriaProps: {tabIndex: 0}});

        expect(screen.getByRole('button', {name: 'Settings'}).tabIndex).toBe(0);
    });

    it('activates a focusable itemWrapper item with Enter on keydown and Space on keyup', () => {
        const onItemClick = jest.fn();
        renderWrappedItem({menuItemAriaProps: {tabIndex: 0}, onItemClick});

        const item = screen.getByRole('button', {name: 'Settings'});
        fireEvent.keyDown(item, {key: 'Enter'});
        expect(onItemClick).toHaveBeenCalledTimes(1);

        fireEvent.keyUp(item, {key: ' '});
        expect(onItemClick).toHaveBeenCalledTimes(2);
    });

    it('does not repeat Space activation while held, firing once on release', () => {
        const onItemClick = jest.fn();
        renderWrappedItem({menuItemAriaProps: {tabIndex: 0}, onItemClick});

        const item = screen.getByRole('button', {name: 'Settings'});
        fireEvent.keyDown(item, {key: ' '});
        fireEvent.keyDown(item, {key: ' ', repeat: true});
        fireEvent.keyDown(item, {key: ' ', repeat: true});
        expect(onItemClick).not.toHaveBeenCalled();

        fireEvent.keyUp(item, {key: ' '});
        expect(onItemClick).toHaveBeenCalledTimes(1);
    });

    it('ignores keyboard events bubbling up from nested controls', () => {
        const onItemClick = jest.fn();
        renderWrappedItem({menuItemAriaProps: {tabIndex: 0}, onItemClick});

        const nested = screen.getByText('Settings');
        fireEvent.keyDown(nested, {key: 'Enter'});
        fireEvent.keyUp(nested, {key: ' '});

        expect(onItemClick).not.toHaveBeenCalled();
    });
});
