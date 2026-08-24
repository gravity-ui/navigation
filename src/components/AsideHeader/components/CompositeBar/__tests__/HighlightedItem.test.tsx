/**
 * @jest-environment jsdom
 */
import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {act, render} from '@testing-library/react';

import {OpenModalSubscriber} from '../../../../types';
import {
    AsideHeaderInnerContextProvider,
    AsideHeaderInnerContextType,
} from '../../../AsideHeaderContext';
import {HighlightedItem} from '../HighlightedItem/HighlightedItem';

describe('HighlightedItem', () => {
    it('copies compact density properties to its portal root', () => {
        let modalSubscriber: OpenModalSubscriber | undefined;
        const openModalSubscriber = (subscriber: OpenModalSubscriber) => {
            modalSubscriber = subscriber;
        };
        const iconRef = React.createRef<HTMLDivElement>();
        const contextValue: AsideHeaderInnerContextType = {
            compact: false,
            size: 220,
            menuDensity: 'compact',
            menuItems: [],
            allPagesIsAvailable: false,
            onItemClick: () => {},
            openModalSubscriber,
        };

        render(
            <ThemeProvider theme="light">
                <AsideHeaderInnerContextProvider value={contextValue}>
                    <div ref={iconRef} />
                    <HighlightedItem iconRef={iconRef} iconNode={<span>Icon</span>} />
                </AsideHeaderInnerContextProvider>
            </ThemeProvider>,
        );

        act(() => modalSubscriber?.(true));

        // Portal renders this node in document.body, outside the PageLayout CSS cascade.
        // eslint-disable-next-line testing-library/no-node-access
        const highlightedItem = document.querySelector<HTMLElement>(
            '.gn-composite-bar-highlighted-item',
        );

        expect(highlightedItem).toBeTruthy();
        expect(
            highlightedItem?.style.getPropertyValue(
                '--_--gn-aside-header-density-icon-background-size',
            ),
        ).toBe('32px');
        expect(
            highlightedItem?.style.getPropertyValue(
                '--_--gn-aside-header-density-item-collapsed-radius',
            ),
        ).toBe('6px');
    });
});
