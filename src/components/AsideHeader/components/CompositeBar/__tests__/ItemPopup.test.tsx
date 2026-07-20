/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {RealTheme, ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen} from '@testing-library/react';

import {AsideHeaderInnerContextProvider} from '../../../AsideHeaderContext';
import {AsideHeaderItem} from '../../../types';
import {ItemPopup, getItemPopoverOffset} from '../Item/ItemPopup';

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
    theme?: RealTheme;
    invertTheme?: boolean;
}) {
    return render(
        <ThemeProvider theme={props.theme ?? 'light'}>
            <AsideHeaderInnerContextProvider value={contextValue}>
                <ItemPopup
                    items={props.items}
                    title={props.title}
                    open={props.open ?? true}
                    onOpenChange={props.onOpenChange ?? (() => {})}
                    collapsed={props.collapsed}
                    hideIcon={props.hideIcon}
                    onItemClick={props.onItemClick}
                    invertTheme={props.invertTheme}
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

    it('renders action items as regular rows (not floating action buttons) inside the popup', () => {
        const items: AsideHeaderItem[] = [
            {id: 'item1', title: 'Create', icon: Gear, type: 'action'},
        ];

        renderItemPopup({items, open: true});

        expect(screen.getByText('Create')).toBeTruthy();
        // eslint-disable-next-line testing-library/no-node-access
        const row = document.querySelector('[data-type]');
        expect(row).toBeTruthy();
        expect(row?.getAttribute('data-type')).toBe('regular');
        expect(row?.className).not.toContain('_type_action');
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

    it('renders titleLines: 2 items as single-line rows inside the popup', () => {
        const items: AsideHeaderItem[] = [
            {
                id: 'long',
                title: 'Long title that wraps onto two lines',
                icon: Gear,
                titleLines: 2,
            },
        ];

        renderItemPopup({items, open: true, title: 'Section'});

        // eslint-disable-next-line testing-library/no-node-access
        const row = screen.getByText('Long title that wraps onto two lines').closest('[data-type]');
        expect(row?.className).toContain('__popup-item');
        expect(row?.className).not.toContain('title-lines_2');

        // eslint-disable-next-line testing-library/no-node-access
        const listItem = row?.closest('.gn-composite-bar-item__root-menu-item');
        expect(listItem).toBeTruthy();
        expect(listItem?.getAttribute('style')).toContain('height: 32px');
    });

    it('uses zero crossAxis offset for a single-item solo popup', () => {
        expect(
            getItemPopoverOffset({isSingleLabel: true, itemHeight: 40, popupRowHeight: 32}),
        ).toEqual({mainAxis: 14, crossAxis: 0});
        expect(
            getItemPopoverOffset({isSingleLabel: false, itemHeight: 40, popupRowHeight: 32}),
        ).toEqual({mainAxis: 14, crossAxis: 2});
    });

    it('uses tighter padding for a single-item solo popup', () => {
        const items: AsideHeaderItem[] = [{id: 'home', title: 'Home', icon: Gear}];

        renderItemPopup({items, open: true});

        // eslint-disable-next-line testing-library/no-node-access
        const listItem = screen.getByText('Home').closest('.gn-composite-bar-item__root-menu-item');
        expect(listItem?.getAttribute('style')).toContain('height: 28px');
        // eslint-disable-next-line testing-library/no-node-access
        expect(listItem?.className).toContain('__root-menu-item');
        // eslint-disable-next-line testing-library/no-node-access
        const listItemsContainer = document.querySelector('.g-list__items');
        expect(listItemsContainer?.getAttribute('style')).toContain('height: 28px');
        // eslint-disable-next-line testing-library/no-node-access
        const popup = document.querySelector('.g-popup');
        expect(popup?.getAttribute('style')).toContain('--g-popup-border-radius: 4px');
    });

    it.each([
        ['light', 'dark'],
        ['dark', 'light'],
        ['light-hc', 'dark-hc'],
        ['dark-hc', 'light-hc'],
    ] as const)(
        'uses the opposite %s theme for a solo popup when enabled',
        (theme, oppositeTheme) => {
            renderItemPopup({
                items: [{id: 'home', title: 'Home', icon: Gear}],
                open: true,
                theme,
                invertTheme: true,
            });

            // eslint-disable-next-line testing-library/no-node-access
            const popup = document.querySelector('.g-popup');
            expect(popup?.classList.contains(`g-root_theme_${oppositeTheme}`)).toBe(true);
        },
    );

    it('keeps the current theme for a group popup when solo theme inversion is enabled', () => {
        renderItemPopup({
            items: [
                {id: 'first', title: 'First', icon: Gear},
                {id: 'second', title: 'Second', icon: Gear},
            ],
            open: true,
            theme: 'light',
            invertTheme: true,
        });

        // eslint-disable-next-line testing-library/no-node-access
        const popup = document.querySelector('.g-popup');
        expect(popup?.classList.contains('g-root_theme_dark')).toBe(false);
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
