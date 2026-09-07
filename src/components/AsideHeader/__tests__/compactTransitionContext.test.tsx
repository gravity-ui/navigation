/**
 * @jest-environment jsdom
 */
import React from 'react';

import {render, screen} from '@testing-library/react';

import {
    AsideHeaderContextProvider,
    AsideHeaderContextType,
    AsideHeaderInnerContextProvider,
    AsideHeaderInnerContextType,
} from '../AsideHeaderContext';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';
import {Panels} from '../components/Panels';

jest.mock('@gravity-ui/uikit', () => ({
    ...jest.requireActual('@gravity-ui/uikit'),
    Drawer: ({className}: {className?: string}) => (
        <div data-testid="drawer" className={className} />
    ),
}));

jest.mock('../components', () => {
    const {useAsideHeaderInnerContext} =
        jest.requireActual<typeof import('../AsideHeaderContext')>('../AsideHeaderContext');
    return {
        FirstPanel: () => {
            const {compactTransition} = useAsideHeaderInnerContext();
            return <output data-testid="inner-transition">{String(compactTransition)}</output>;
        },
    };
});

jest.mock('../components/AllPagesPanel', () => ({
    AllPagesPanel: () => null,
    getAllPagesMenuItem: () => ({id: 'all-pages', title: 'All pages'}),
}));

const legacyOuterValue: AsideHeaderContextType = {
    compact: false,
    size: 236,
    menuDensity: 'default' as const,
};

const legacyInnerValue: AsideHeaderInnerContextType = {
    compact: false,
    size: 236,
    menuDensity: 'default' as const,
    menuItems: [],
    panelItems: [{id: 'details', open: true, children: 'Details'}],
    allPagesIsAvailable: false,
    quickAccessIsAvailable: false,
    onItemClick: jest.fn(),
    onToggleQuickAccess: jest.fn(),
};

test('PageLayoutAside defaults an older outer context value to enabled transitions', () => {
    render(
        <AsideHeaderContextProvider value={legacyOuterValue}>
            <PageLayoutAside />
        </AsideHeaderContextProvider>,
    );

    expect(screen.getByTestId('inner-transition').textContent).toBe('true');
});

test('Panels defaults an older inner context value to the enabled class', () => {
    render(
        <AsideHeaderInnerContextProvider value={legacyInnerValue}>
            <Panels />
        </AsideHeaderInnerContextProvider>,
    );

    expect(screen.getByTestId('drawer').className).toContain('compact-transition');
    expect(screen.getByTestId('drawer').className).not.toContain('disabled');
});

test('Panels updates its class when only the transition flag changes', () => {
    const {rerender} = render(
        <AsideHeaderInnerContextProvider value={{...legacyInnerValue, compactTransition: true}}>
            <Panels />
        </AsideHeaderInnerContextProvider>,
    );
    const enabledClassName = screen.getByTestId('drawer').className;

    rerender(
        <AsideHeaderInnerContextProvider value={{...legacyInnerValue, compactTransition: false}}>
            <Panels />
        </AsideHeaderInnerContextProvider>,
    );

    expect(screen.getByTestId('drawer').className).not.toBe(enabledClassName);
    expect(screen.getByTestId('drawer').className).toContain('disabled');
});
