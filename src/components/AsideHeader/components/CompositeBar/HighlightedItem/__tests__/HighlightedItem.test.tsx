/**
 * @jest-environment jsdom
 */
import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {act, render} from '@testing-library/react';

import type {OpenModalSubscriber} from '../../../../../types';
import {AsideHeaderInnerContextProvider} from '../../../../AsideHeaderContext';
import {HighlightedItem} from '../HighlightedItem';

function renderHighlightedItem({iconElement}: {iconElement: HTMLElement}) {
    let openModal: OpenModalSubscriber | undefined;

    const contextValue = {
        compact: false,
        size: 236,
        menuDensity: 'default',
        menuItems: [],
        allPagesIsAvailable: false,
        quickAccessIsAvailable: false,
        onItemClick: () => {},
        onToggleQuickAccess: () => {},
        openModalSubscriber: (subscriber: OpenModalSubscriber) => {
            openModal = subscriber;
        },
    } as never;

    const view = render(
        <ThemeProvider theme="light">
            <AsideHeaderInnerContextProvider value={contextValue}>
                <HighlightedItem
                    iconRef={{current: iconElement as HTMLDivElement}}
                    iconNode={<span />}
                />
            </AsideHeaderInnerContextProvider>
        </ThemeProvider>,
    );

    act(() => {
        openModal?.(true);
    });

    return view;
}

describe('HighlightedItem geometry', () => {
    it('transfers the resolved icon background size from the original row to the portal', () => {
        const iconElement = document.createElement('div');
        document.body.appendChild(iconElement);

        jest.spyOn(window, 'getComputedStyle').mockReturnValue({
            getPropertyValue: (name: string) =>
                name === '--gn-aside-header-item-icon-background-size' ? '32px' : '',
        } as CSSStyleDeclaration);

        renderHighlightedItem({iconElement});

        // eslint-disable-next-line testing-library/no-node-access
        const portal = document.querySelector<HTMLElement>('.gn-composite-bar-highlighted-item');
        expect(portal?.style.getPropertyValue('--gn-aside-header-item-icon-background-size')).toBe(
            '32px',
        );

        jest.restoreAllMocks();
    });

    it('keeps the density fallback when the original row defines no override', () => {
        const iconElement = document.createElement('div');
        document.body.appendChild(iconElement);

        renderHighlightedItem({iconElement});

        // eslint-disable-next-line testing-library/no-node-access
        const portal = document.querySelector<HTMLElement>('.gn-composite-bar-highlighted-item');
        expect(portal).not.toBeNull();
        expect(portal?.style.getPropertyValue('--gn-aside-header-item-icon-background-size')).toBe(
            '',
        );
    });
});
