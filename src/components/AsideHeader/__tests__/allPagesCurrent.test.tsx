/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen} from '@testing-library/react';

import {AsideHeader} from '../AsideHeader';

jest.mock('../i18n');

jest.mock('../../../../assets/icons/divider-collapsed.svg', () => ({
    __esModule: true,
    default: 'divider-collapsed.svg',
}));

jest.mock('react-virtualized-auto-sizer', () => ({
    __esModule: true,
    default: ({children}: {children: (size: {width: number; height: number}) => React.ReactNode}) =>
        children({width: 240, height: 400}),
}));

const CURRENT_CLASS = 'gn-composite-bar-item_current';

function getRow(name: string) {
    // The open Drawer hides the aside from the accessibility tree.
    return screen.getAllByRole('button', {name, hidden: true})[0];
}

describe('current highlighting while the All pages panel is open', () => {
    it('mutes the consumer current item and restores it after the panel closes', () => {
        render(
            <ThemeProvider theme="light">
                <AsideHeader
                    compact={false}
                    menuItems={[{id: 'home', title: 'Home', icon: Gear, current: true}]}
                    onMenuItemsChanged={jest.fn()}
                    renderContent={() => null}
                />
            </ThemeProvider>,
        );

        expect(getRow('Home').className).toContain(CURRENT_CLASS);

        const allPagesRow = getRow('All pages');
        fireEvent.click(allPagesRow);

        expect(getRow('All pages').className).toContain(CURRENT_CLASS);
        expect(getRow('Home').className).not.toContain(CURRENT_CLASS);

        fireEvent.click(getRow('All pages'));

        expect(getRow('Home').className).toContain(CURRENT_CLASS);
        expect(getRow('All pages').className).not.toContain(CURRENT_CLASS);
    });

    it('mutes the quick access row of the current item as well', () => {
        render(
            <ThemeProvider theme="light">
                <AsideHeader
                    compact={false}
                    menuItems={[
                        {
                            id: 'home',
                            title: 'Home',
                            icon: Gear,
                            current: true,
                            quickAccess: true,
                        },
                    ]}
                    enableQuickAccess
                    onQuickAccessChange={jest.fn()}
                    onMenuItemsChanged={jest.fn()}
                    renderContent={() => null}
                />
            </ThemeProvider>,
        );

        // Two rows for the same item: the quick access section and the main menu.
        const homeRows = screen.getAllByRole('button', {name: 'Home', hidden: true});
        expect(homeRows).toHaveLength(2);

        fireEvent.click(getRow('All pages'));

        for (const row of screen.getAllByRole('button', {name: 'Home', hidden: true})) {
            expect(row.className).not.toContain(CURRENT_CLASS);
        }
    });

    it('keeps the current highlight when a consumer item reuses the reserved id without the panel', () => {
        render(
            <ThemeProvider theme="light">
                <AsideHeader
                    compact={false}
                    // No onMenuItemsChanged: the built-in All pages panel does not exist.
                    menuItems={[
                        {id: 'all-pages', title: 'Reserved', icon: Gear},
                        {id: 'home', title: 'Home', icon: Gear, current: true},
                    ]}
                    renderContent={() => null}
                />
            </ThemeProvider>,
        );

        fireEvent.click(getRow('Reserved'));

        expect(getRow('Home').className).toContain(CURRENT_CLASS);
    });
});
