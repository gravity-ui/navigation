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
    menuDensity: 'default' as const,
    menuItems: [],
    allPagesIsAvailable: false,
    quickAccessIsAvailable: false,
    onToggleQuickAccess: () => {},
    onItemClick: () => {},
};

function renderItemPopup(props: {
    items: AsideHeaderItem[];
    onItemClick?: jest.Mock;
    onOpenChange?: jest.Mock;
    collapsed?: boolean;
    hideIcon?: boolean;
    open?: boolean;
    title?: string;
}) {
    return render(
        <ThemeProvider theme="light">
            <AsideHeaderInnerContextProvider value={contextValue}>
                <ItemPopup
                    items={props.items}
                    title={props.title}
                    open={props.open ?? true}
                    onOpenChange={props.onOpenChange ?? (() => {})}
                    collapsed={props.collapsed}
                    hideIcon={props.hideIcon}
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

    it('does not close popup when clicking the current item inside popup', () => {
        const onOpenChange = jest.fn();
        const onItemClick = jest.fn();
        const items: AsideHeaderItem[] = [
            {id: 'item1', title: 'Current Item', icon: Gear, current: true},
        ];

        renderItemPopup({items, onItemClick, onOpenChange, open: true});

        fireEvent.click(screen.getByText('Current Item'));

        expect(onItemClick).toHaveBeenCalled();
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
    });

    it('closes popup when clicking a non-current item inside popup', () => {
        const onOpenChange = jest.fn();
        const items: AsideHeaderItem[] = [{id: 'item1', title: 'Other Item', icon: Gear}];

        renderItemPopup({items, onOpenChange, open: true});

        fireEvent.click(screen.getByText('Other Item'));

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('renders items with icons when hideIcon is false', () => {
        const items: AsideHeaderItem[] = [
            {id: 'item1', title: 'With Icon', icon: Gear, iconQa: 'icon-item1'},
        ];

        renderItemPopup({items, open: true, hideIcon: false});

        // eslint-disable-next-line testing-library/no-node-access
        expect(document.querySelector('[data-qa="icon-item1"]')).toBeTruthy();
    });

    it('hides icons by default', () => {
        const items: AsideHeaderItem[] = [
            {id: 'item1', title: 'No Icon', icon: Gear, iconQa: 'icon-item1'},
        ];

        renderItemPopup({items, open: true});

        // eslint-disable-next-line testing-library/no-node-access
        expect(document.querySelector('[data-qa="icon-item1"]')).toBeNull();
    });

    it('renders title at the top of the popup when title prop is provided', () => {
        const items: AsideHeaderItem[] = [
            {id: 'item1', title: 'Child 1', icon: Gear},
            {id: 'item2', title: 'Child 2', icon: Gear},
        ];

        renderItemPopup({items, open: true, title: 'Ресурсы'});

        expect(screen.getByText('Ресурсы')).toBeTruthy();
    });

    it('does not render a title element when title prop is not provided', () => {
        const items: AsideHeaderItem[] = [{id: 'item1', title: 'Child 1', icon: Gear}];

        renderItemPopup({items, open: true});

        // eslint-disable-next-line testing-library/no-node-access
        expect(document.querySelector('.gn-composite-bar-item__popup-title')).toBeNull();
    });

    it('does not render a title element when title is an empty string', () => {
        const items: AsideHeaderItem[] = [{id: 'item1', title: 'Child 1', icon: Gear}];

        renderItemPopup({items, open: true, title: ''});

        // eslint-disable-next-line testing-library/no-node-access
        expect(document.querySelector('.gn-composite-bar-item__popup-title')).toBeNull();
    });

    it('lets itemWrapper receive bubbled clicks in popup', () => {
        const onWrapperClick = jest.fn();
        const items: AsideHeaderItem[] = [
            {
                id: 'item1',
                title: 'Wrapped item',
                icon: Gear,
                itemWrapper: (params, makeItem) => (
                    <a href="/test" data-testid="item-wrapper" onClick={onWrapperClick}>
                        {makeItem(params)}
                    </a>
                ),
            },
        ];

        renderItemPopup({items, open: true});

        fireEvent.click(screen.getByText('Wrapped item'));

        expect(onWrapperClick).toHaveBeenCalledTimes(1);
        // itemWrapper uses a div (not a nested button) so the link can handle navigation.
        // eslint-disable-next-line testing-library/no-node-access
        expect(screen.getByText('Wrapped item').closest('[role="button"]')?.tagName).toBe('DIV');
    });

    it('uses onPopupItemClick for popup rows when provided', () => {
        const onPopupItemClick = jest.fn();
        const onItemClick = jest.fn();
        const items: AsideHeaderItem[] = [{id: 'item1', title: 'Child', icon: Gear}];

        render(
            <ThemeProvider theme="light">
                <AsideHeaderInnerContextProvider value={contextValue}>
                    <ItemPopup
                        items={items}
                        open
                        onOpenChange={() => {}}
                        onPopupItemClick={onPopupItemClick}
                        onItemClick={onItemClick}
                    >
                        <button type="button">Trigger</button>
                    </ItemPopup>
                </AsideHeaderInnerContextProvider>
            </ThemeProvider>,
        );

        fireEvent.click(screen.getByText('Child'));

        expect(onPopupItemClick).toHaveBeenCalledWith(
            expect.objectContaining({id: 'item1'}),
            false,
            expect.any(Object),
        );
        expect(onItemClick).not.toHaveBeenCalled();
    });

    it('stops click propagation at the popup content boundary when itemWrapper is not provided', () => {
        const onParentClick = jest.fn();
        const items: AsideHeaderItem[] = [{id: 'item1', title: 'Plain item', icon: Gear}];

        render(
            <ThemeProvider theme="light">
                <AsideHeaderInnerContextProvider value={contextValue}>
                    <div data-testid="parent" onClick={onParentClick}>
                        <ItemPopup items={items} open onOpenChange={() => {}}>
                            <button type="button">Trigger</button>
                        </ItemPopup>
                    </div>
                </AsideHeaderInnerContextProvider>
            </ThemeProvider>,
        );

        fireEvent.click(screen.getByText('Plain item'));

        expect(onParentClick).not.toHaveBeenCalled();
    });

    it('stops click propagation at the popup content boundary when itemWrapper is provided', () => {
        const onParentClick = jest.fn();
        const items: AsideHeaderItem[] = [
            {
                id: 'item1',
                title: 'Wrapped item',
                icon: Gear,
                itemWrapper: (params, makeItem) => (
                    <div data-testid="item-wrapper">{makeItem(params)}</div>
                ),
            },
        ];

        render(
            <ThemeProvider theme="light">
                <AsideHeaderInnerContextProvider value={contextValue}>
                    <div data-testid="parent" onClick={onParentClick}>
                        <ItemPopup items={items} open onOpenChange={() => {}}>
                            <button type="button">Trigger</button>
                        </ItemPopup>
                    </div>
                </AsideHeaderInnerContextProvider>
            </ThemeProvider>,
        );

        fireEvent.click(screen.getByText('Wrapped item'));

        expect(onParentClick).not.toHaveBeenCalled();
    });
});
