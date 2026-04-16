/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen} from '@testing-library/react';

import {AsideHeaderInnerContextProvider} from '../../../AsideHeaderContext';
import {AsideHeaderItem} from '../../../types';
import {ItemPopup} from '../Item/ItemPopup';

const contextValue = {
    compact: false,
    size: 200,
    menuItems: [],
    allPagesIsAvailable: false,
    onItemClick: () => {},
};

function renderItemPopup(props: {
    items: AsideHeaderItem[];
    onItemClick?: jest.Mock;
    collapsed?: boolean;
    hideIcon?: boolean;
    open?: boolean;
    trigger?: 'click';
}) {
    return render(
        <ThemeProvider theme="light">
            <AsideHeaderInnerContextProvider value={contextValue}>
                <ItemPopup
                    items={props.items}
                    open={props.open ?? true}
                    onOpenChange={() => {}}
                    collapsed={props.collapsed}
                    hideIcon={props.hideIcon}
                    trigger={props.trigger}
                    onItemClick={props.onItemClick}
                >
                    <button data-testid="trigger">Trigger</button>
                </ItemPopup>
            </AsideHeaderInnerContextProvider>
        </ThemeProvider>,
    );
}

describe('ItemPopup', () => {
    it('renders trigger when items array is empty', () => {
        renderItemPopup({items: [], open: true});
        expect(screen.getByTestId('trigger')).toBeTruthy();
    });

    it('renders items via List when open in Popover mode', () => {
        const items: AsideHeaderItem[] = [
            {id: 'item1', title: 'Item 1', icon: Gear},
            {id: 'item2', title: 'Item 2', icon: Gear},
        ];

        renderItemPopup({items, open: true});

        expect(screen.getByText('Item 1')).toBeTruthy();
        expect(screen.getByText('Item 2')).toBeTruthy();
    });

    it('calls onItemClick with original item and collapsed=true when collapsed prop is set', () => {
        const onItemClick = jest.fn();
        const itemOnClick = jest.fn();
        const items: AsideHeaderItem[] = [
            {id: 'item1', title: 'Click Me', icon: Gear, onItemClick: itemOnClick},
        ];

        renderItemPopup({items, onItemClick, collapsed: true, open: true});

        const popupItem = screen.getByText('Click Me');
        fireEvent.click(popupItem);

        expect(onItemClick).toHaveBeenCalledWith(
            expect.objectContaining({id: 'item1', onItemClick: itemOnClick}),
            true,
            expect.any(Object),
        );
    });

    it('calls onItemClick with collapsed=false by default', () => {
        const onItemClick = jest.fn();
        const items: AsideHeaderItem[] = [{id: 'item1', title: 'Click Me', icon: Gear}];

        renderItemPopup({items, onItemClick, open: true});

        const popupItem = screen.getByText('Click Me');
        fireEvent.click(popupItem);

        expect(onItemClick).toHaveBeenCalledWith(
            expect.objectContaining({id: 'item1'}),
            false,
            expect.any(Object),
        );
    });

    it('renders items with icons when hideIcon is false', () => {
        const items: AsideHeaderItem[] = [
            {id: 'item1', title: 'With Icon', icon: Gear, iconQa: 'icon-item1'},
        ];

        renderItemPopup({items, open: true, hideIcon: false});

        // eslint-disable-next-line testing-library/no-node-access
        expect(document.querySelector('[data-qa="icon-item1"]')).toBeTruthy();
    });

    it('hides icons by default (hideIcon=true)', () => {
        const items: AsideHeaderItem[] = [
            {id: 'item1', title: 'No Icon', icon: Gear, iconQa: 'icon-item1'},
        ];

        renderItemPopup({items, open: true});

        // eslint-disable-next-line testing-library/no-node-access
        expect(document.querySelector('[data-qa="icon-item1"]')).toBeNull();
    });
});
