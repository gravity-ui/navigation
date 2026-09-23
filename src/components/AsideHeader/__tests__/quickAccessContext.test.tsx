/**
 * @jest-environment jsdom
 */
import React from 'react';

import {fireEvent, render, screen} from '@testing-library/react';

import {AsideHeaderItem, AsideHeaderProps} from '../types';
import {useAsideHeaderInnerContextValue} from '../useAsideHeaderInnerContextValue';

jest.mock('../components/AllPagesPanel', () => ({
    AllPagesPanel: () => null,
    getAllPagesMenuItem: () => ({id: 'all-pages', title: 'All pages'}),
}));

const item: AsideHeaderItem = {id: 'home', title: 'Home', current: true};

type ContextProbeProps = AsideHeaderProps & {
    triggerItem?: AsideHeaderItem;
};

function ContextProbe({triggerItem = item, ...props}: ContextProbeProps) {
    const context = useAsideHeaderInnerContextValue({...props, size: 220});

    return (
        <button type="button" onClick={() => context.onToggleQuickAccess(triggerItem)}>
            {context.quickAccessIsAvailable ? 'enabled' : 'disabled'}
        </button>
    );
}

describe('quick access context', () => {
    it('reports the original item and next controlled value without onMenuItemsChanged', () => {
        const onQuickAccessChange = jest.fn();

        render(
            <ContextProbe
                compact={false}
                menuItems={[item]}
                enableQuickAccess
                onQuickAccessChange={onQuickAccessChange}
            />,
        );

        fireEvent.click(screen.getByRole('button', {name: 'enabled'}));

        expect(onQuickAccessChange).toHaveBeenCalledWith(item, true);
    });

    it('resolves a derived popup item to the original controlled item when unpinning', () => {
        const originalItem: AsideHeaderItem = {
            id: 'analytics',
            title: 'Analytics',
            current: true,
            quickAccess: true,
        };
        const originalItemSnapshot = {...originalItem};
        const onQuickAccessChange = jest.fn();

        render(
            <ContextProbe
                compact={false}
                menuItems={[originalItem]}
                enableQuickAccess
                onQuickAccessChange={onQuickAccessChange}
                triggerItem={{...originalItem, current: false}}
            />,
        );

        fireEvent.click(screen.getByRole('button', {name: 'enabled'}));

        expect(onQuickAccessChange).toHaveBeenCalledWith(originalItem, false);
        expect(originalItem).toEqual(originalItemSnapshot);
    });

    it('ignores an ineligible item even when pinning is enabled', () => {
        const actionItem: AsideHeaderItem = {id: 'create', title: 'Create', type: 'action'};
        const onQuickAccessChange = jest.fn();

        render(
            <ContextProbe
                compact={false}
                menuItems={[actionItem]}
                enableQuickAccess
                onQuickAccessChange={onQuickAccessChange}
                triggerItem={actionItem}
            />,
        );

        fireEvent.click(screen.getByRole('button', {name: 'enabled'}));

        expect(onQuickAccessChange).not.toHaveBeenCalled();
    });

    it('does not expose pinning when quick access is disabled', () => {
        render(<ContextProbe compact={false} menuItems={[item]} onQuickAccessChange={jest.fn()} />);

        expect(screen.getByRole('button', {name: 'disabled'})).toBeTruthy();
    });
});
