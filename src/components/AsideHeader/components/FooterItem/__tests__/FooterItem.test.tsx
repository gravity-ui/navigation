/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {render, screen} from '@testing-library/react';

import {AsideHeaderContextProvider} from '../../../AsideHeaderContext';
import {FooterItem} from '../FooterItem';

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
});
