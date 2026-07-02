/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {act, fireEvent, render, screen} from '@testing-library/react';

import {MenuGroup} from '../../../../types';
import {AsideHeaderInnerContextProvider} from '../../../AsideHeaderContext';
import {AsideHeaderItem, AsideHeaderMenuOverflow} from '../../../types';
import {CompositeBar} from '../CompositeBar';

// AutoSizer is only hit by the `collapse` fallback branch; we still mock it so
// that branch produces deterministic sizes regardless of the jsdom viewport.
jest.mock('react-virtualized-auto-sizer', () => ({
    __esModule: true,
    default: ({children}: {children: (size: {width: number; height: number}) => React.ReactNode}) =>
        children({width: 200, height: 80}),
}));

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

function renderBar(props: {
    items: AsideHeaderItem[];
    onItemClick?: jest.Mock;
    onMoreClick?: jest.Mock;
    menuOverflow?: AsideHeaderMenuOverflow;
    compact?: boolean;
    menuMoreTitle?: string;
    menuGroups?: MenuGroup[];
    collapsedMenuGroupIds?: Record<string, boolean>;
    onToggleMenuGroupCollapsed?: jest.Mock;
    menuGroupNestedIcons?: boolean;
}) {
    return render(
        <ThemeProvider theme="light">
            <AsideHeaderInnerContextProvider value={contextValue}>
                <CompositeBar
                    type="menu"
                    items={props.items}
                    menuGroups={props.menuGroups}
                    compact={props.compact ?? false}
                    onItemClick={props.onItemClick ?? jest.fn()}
                    onMoreClick={props.onMoreClick}
                    menuMoreTitle={props.menuMoreTitle ?? 'More'}
                    menuOverflow={props.menuOverflow ?? 'scroll'}
                    collapsedMenuGroupIds={props.collapsedMenuGroupIds}
                    onToggleMenuGroupCollapsed={props.onToggleMenuGroupCollapsed}
                    menuGroupNestedIcons={props.menuGroupNestedIcons}
                />
            </AsideHeaderInnerContextProvider>
        </ThemeProvider>,
    );
}

describe('CompositeBar menuOverflow="scroll"', () => {
    const items: AsideHeaderItem[] = [
        {id: 'item1', title: 'Item 1', icon: Gear},
        {id: 'item2', title: 'Item 2', icon: Gear},
        {id: 'item3', title: 'Item 3', icon: Gear},
    ];

    it('renders all items directly, without the "More" collapse button', () => {
        renderBar({items});

        expect(screen.getByText('Item 1')).toBeTruthy();
        expect(screen.getByText('Item 2')).toBeTruthy();
        expect(screen.getByText('Item 3')).toBeTruthy();
        expect(screen.queryByText('More')).toBeNull();
    });

    it('does not call onMoreClick when there are many items', () => {
        const onMoreClick = jest.fn();
        renderBar({items, onMoreClick});

        expect(onMoreClick).not.toHaveBeenCalled();
    });

    it('invokes onItemClick when a regular item is clicked', () => {
        const onItemClick = jest.fn();
        const itemClick = jest.fn();
        renderBar({
            items: [{id: 'a', title: 'Alpha', icon: Gear, onItemClick: itemClick}],
            onItemClick,
        });

        fireEvent.click(screen.getByText('Alpha'));

        expect(onItemClick).toHaveBeenCalledWith(
            expect.objectContaining({id: 'a', onItemClick: itemClick}),
            false,
            expect.any(Object),
        );
    });

    it('falls back to the "collapse" behavior (with "More" popup) when compact is true', () => {
        // AutoSizer mock returns height=80, which with ITEM_HEIGHT=40 keeps only
        // the first item + the collapse button, so "More" is expected to appear.
        const manyItems: AsideHeaderItem[] = [
            {id: 'i1', title: 'Item 1', icon: Gear},
            {id: 'i2', title: 'Item 2', icon: Gear},
            {id: 'i3', title: 'Item 3', icon: Gear},
        ];

        renderBar({
            items: manyItems,
            menuOverflow: 'scroll',
            compact: true,
            menuMoreTitle: 'More',
        });

        expect(screen.getByText('More')).toBeTruthy();
    });

    it('moves afterMoreButton items to the end of the list', () => {
        renderBar({
            items: [
                {id: 'a', title: 'Alpha', icon: Gear},
                {id: 'action', title: 'Create', icon: Gear, afterMoreButton: true, type: 'action'},
                {id: 'b', title: 'Bravo', icon: Gear},
            ],
        });

        const titles = screen
            .getAllByRole('listitem')
            .map((li) => li.textContent?.trim())
            .filter(Boolean);

        expect(titles).toEqual(['Alpha', 'Bravo', 'Create']);
    });

    it('renders group children inline in the main list when scroll mode is active', () => {
        const menuGroups: MenuGroup[] = [{id: 'g1', title: 'Access', icon: Gear}];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, groupId: 'g1'},
            {id: 'pat', title: 'Personal access tokens', icon: Gear, groupId: 'g1'},
        ];

        renderBar({items: groupItems, menuGroups, menuOverflow: 'scroll', compact: false});

        expect(screen.getByText('Access')).toBeTruthy();
        expect(screen.getByText('SSH Keys')).toBeTruthy();
        expect(screen.getByText('Personal access tokens')).toBeTruthy();
    });

    it('shows icons for inline group children alongside tree connectors', () => {
        const menuGroups: MenuGroup[] = [{id: 'g1', title: 'Access', icon: Gear}];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, groupId: 'g1'},
            {id: 'pat', title: 'Personal access tokens', icon: Gear, groupId: 'g1'},
        ];

        renderBar({
            items: groupItems,
            menuGroups,
            menuOverflow: 'scroll',
            compact: false,
            menuGroupNestedIcons: true,
        });

        for (const title of ['SSH Keys', 'Personal access tokens']) {
            const titleEl = screen.getByText(title);
            // eslint-disable-next-line testing-library/no-node-access
            const nestedItem = titleEl.closest('.gn-composite-bar-item');

            expect(nestedItem?.classList.contains('gn-composite-bar-item_hide-icon')).toBe(false);
            expect(nestedItem?.classList.contains('gn-composite-bar-item_menu-group-nested')).toBe(
                true,
            );
            // eslint-disable-next-line testing-library/no-node-access
            expect(nestedItem?.querySelector('.gn-composite-bar-item__icon')).toBeTruthy();
        }
    });

    it('hides icons for inline group children when menuGroupNestedIcons is false', () => {
        const menuGroups: MenuGroup[] = [{id: 'g1', title: 'Access', icon: Gear}];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, groupId: 'g1'},
        ];

        renderBar({
            items: groupItems,
            menuGroups,
            menuOverflow: 'scroll',
            compact: false,
            menuGroupNestedIcons: false,
        });

        const titleEl = screen.getByText('SSH Keys');
        // eslint-disable-next-line testing-library/no-node-access
        const nestedItem = titleEl.closest('.gn-composite-bar-item');

        expect(nestedItem?.classList.contains('gn-composite-bar-item_hide-icon')).toBe(true);
        // eslint-disable-next-line testing-library/no-node-access
        expect(nestedItem?.querySelector('.gn-composite-bar-item__icon')).toBeNull();
    });

    it('calls onToggleMenuGroupCollapsed when clicking an inline group header', () => {
        const onToggleMenuGroupCollapsed = jest.fn();
        const menuGroups: MenuGroup[] = [{id: 'g1', title: 'Access', icon: Gear}];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, groupId: 'g1'},
        ];

        renderBar({
            items: groupItems,
            menuGroups,
            menuOverflow: 'scroll',
            compact: false,
            onToggleMenuGroupCollapsed,
        });

        fireEvent.click(screen.getByText('Access'));
        expect(onToggleMenuGroupCollapsed).toHaveBeenCalledWith('g1');
    });

    it('shows collapsed inline group children in a hover popup instead of the main list', () => {
        jest.useFakeTimers();

        const menuGroups: MenuGroup[] = [
            {id: 'g1', title: 'Access', icon: Gear, popupTitle: 'Access items'},
        ];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, groupId: 'g1'},
            {id: 'pat', title: 'Personal access tokens', icon: Gear, groupId: 'g1'},
        ];

        renderBar({
            items: groupItems,
            menuGroups,
            menuOverflow: 'scroll',
            compact: false,
            collapsedMenuGroupIds: {g1: true},
        });

        expect(screen.getByText('Access')).toBeTruthy();
        expect(screen.queryByText('SSH Keys')).toBeNull();
        expect(screen.queryByText('Personal access tokens')).toBeNull();

        fireEvent.mouseEnter(screen.getByRole('button', {name: 'Access'}));

        act(() => {
            jest.advanceTimersByTime(150);
        });

        expect(screen.getByText('SSH Keys')).toBeTruthy();
        expect(screen.queryByText('Access items')).toBeNull();
        expect(screen.getByText('Personal access tokens')).toBeTruthy();

        jest.useRealTimers();
    });

    it('does not show a hover popup for an expanded inline group', () => {
        jest.useFakeTimers();

        const menuGroups: MenuGroup[] = [{id: 'g1', title: 'Access', icon: Gear}];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, groupId: 'g1'},
        ];

        renderBar({
            items: groupItems,
            menuGroups,
            menuOverflow: 'scroll',
            compact: false,
            collapsedMenuGroupIds: {g1: false},
        });

        expect(screen.getByText('SSH Keys')).toBeTruthy();

        fireEvent.mouseEnter(screen.getByText('Access'));

        act(() => {
            jest.advanceTimersByTime(150);
        });

        // eslint-disable-next-line testing-library/no-node-access
        expect(document.querySelectorAll('.gn-composite-bar-item__popup-content')).toHaveLength(0);

        jest.useRealTimers();
    });
});
