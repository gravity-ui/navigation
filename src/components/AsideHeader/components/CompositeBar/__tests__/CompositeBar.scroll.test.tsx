/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen} from '@testing-library/react';

import {MenuGroup} from '../../../../types';
import {AsideHeaderInnerContextProvider} from '../../../AsideHeaderContext';
import {AsideHeaderItem, AsideHeaderMenuOverflow} from '../../../types';
import {CompositeBar} from '../CompositeBar';

jest.mock('../../../i18n');

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
    menuItems: [],
    allPagesIsAvailable: false,
    quickAccessIsAvailable: false,
    onItemClick: () => {},
    onToggleQuickAccess: () => {},
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

    it('opens child items in a popup for a collapsed inline group', () => {
        const menuGroups: MenuGroup[] = [
            {id: 'g1', title: 'Access', icon: Gear, popupTitle: 'Access tools'},
        ];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, groupId: 'g1'},
        ];

        renderBar({
            items: groupItems,
            menuGroups,
            menuOverflow: 'scroll',
            compact: false,
            collapsedMenuGroupIds: {g1: true},
        });

        expect(screen.queryByText('SSH Keys')).toBeNull();
        fireEvent.click(screen.getByText('Access'));

        expect(screen.getByText('Access tools')).toBeTruthy();
        expect(screen.getByText('SSH Keys')).toBeTruthy();
    });

    it('selects a popup child without expanding its collapsed inline group', () => {
        const onItemClick = jest.fn();
        const onToggleMenuGroupCollapsed = jest.fn();
        const itemClick = jest.fn();
        const menuGroups: MenuGroup[] = [
            {id: 'g1', title: 'Access', icon: Gear, popupTitle: 'Access tools'},
        ];
        const groupItems: AsideHeaderItem[] = [
            {
                id: 'ssh',
                title: 'SSH Keys',
                icon: Gear,
                groupId: 'g1',
                onItemClick: itemClick,
            },
        ];

        renderBar({
            items: groupItems,
            menuGroups,
            menuOverflow: 'scroll',
            compact: false,
            collapsedMenuGroupIds: {g1: true},
            onItemClick,
            onToggleMenuGroupCollapsed,
        });

        fireEvent.click(screen.getByText('Access'));
        onItemClick.mockClear();
        onToggleMenuGroupCollapsed.mockClear();

        fireEvent.click(screen.getByText('SSH Keys'));

        expect(onItemClick).toHaveBeenCalledWith(
            expect.objectContaining({id: 'ssh', onItemClick: itemClick}),
            false,
            expect.any(Object),
        );
        expect(onToggleMenuGroupCollapsed).not.toHaveBeenCalled();
    });

    it('can hide icons of nested group items without hiding the group icon', () => {
        const menuGroups: MenuGroup[] = [{id: 'g1', title: 'Access', icon: Gear}];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, iconQa: 'ssh-icon', groupId: 'g1'},
        ];

        renderBar({
            items: groupItems,
            menuGroups,
            menuOverflow: 'scroll',
            compact: false,
            menuGroupNestedIcons: false,
        });

        // eslint-disable-next-line testing-library/no-node-access
        expect(document.querySelector('[data-qa="ssh-icon"]')).toBeNull();
        expect(screen.getByText('Access')).toBeTruthy();
    });

    it('also hides nested item icons in a collapsed group popup', () => {
        const menuGroups: MenuGroup[] = [
            {id: 'g1', title: 'Access', icon: Gear, popupTitle: 'Access tools'},
        ];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, iconQa: 'ssh-icon', groupId: 'g1'},
        ];

        renderBar({
            items: groupItems,
            menuGroups,
            menuOverflow: 'scroll',
            compact: false,
            collapsedMenuGroupIds: {g1: true},
            menuGroupNestedIcons: false,
        });

        fireEvent.click(screen.getByText('Access'));

        expect(screen.getByText('SSH Keys')).toBeTruthy();
        // eslint-disable-next-line testing-library/no-node-access
        expect(document.querySelector('[data-qa="ssh-icon"]')).toBeNull();
    });

    it('applies a two-line title modifier to expanded rows', () => {
        renderBar({
            items: [{id: 'long', title: 'A deliberately long title', titleLines: 2}],
        });

        expect(screen.getByText('A deliberately long title').className).toContain(
            'title-text_lines_2',
        );
    });

    it('does not render a separate chevron control when the group has no own action', () => {
        const menuGroups: MenuGroup[] = [{id: 'g1', title: 'Access', icon: Gear}];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, groupId: 'g1'},
        ];

        renderBar({items: groupItems, menuGroups, menuOverflow: 'scroll', compact: false});

        expect(screen.queryByRole('button', {name: 'Access', expanded: true})).toBeNull();
    });

    it('fires the group action on header click (no toggle) when the group has onItemClick', () => {
        const onToggleMenuGroupCollapsed = jest.fn();
        const onItemClick = jest.fn();
        const groupClick = jest.fn();
        const menuGroups: MenuGroup[] = [
            {id: 'g1', title: 'Access', icon: Gear, onItemClick: groupClick},
        ];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, groupId: 'g1'},
        ];

        renderBar({
            items: groupItems,
            menuGroups,
            menuOverflow: 'scroll',
            compact: false,
            onItemClick,
            onToggleMenuGroupCollapsed,
        });

        fireEvent.click(screen.getByText('Access'));

        expect(onItemClick).toHaveBeenCalledWith(
            expect.objectContaining({onItemClick: groupClick}),
            false,
            expect.any(Object),
        );
        expect(onToggleMenuGroupCollapsed).not.toHaveBeenCalled();
    });

    it('toggles the group only via the chevron when the group has its own action', () => {
        const onToggleMenuGroupCollapsed = jest.fn();
        const onItemClick = jest.fn();
        const menuGroups: MenuGroup[] = [
            {id: 'g1', title: 'Access', icon: Gear, onItemClick: jest.fn()},
        ];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, groupId: 'g1'},
        ];

        renderBar({
            items: groupItems,
            menuGroups,
            menuOverflow: 'scroll',
            compact: false,
            onItemClick,
            onToggleMenuGroupCollapsed,
        });

        // The interactive chevron is the only 'Access' control exposing aria-expanded.
        fireEvent.click(screen.getByRole('button', {name: 'Access', expanded: true}));

        expect(onToggleMenuGroupCollapsed).toHaveBeenCalledWith('g1');
        expect(onItemClick).not.toHaveBeenCalled();
    });

    it('renders the group header as a link when the group has href', () => {
        const onToggleMenuGroupCollapsed = jest.fn();
        const menuGroups: MenuGroup[] = [{id: 'g1', title: 'Access', icon: Gear, href: '/access'}];
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

        const link = screen.getByRole('link', {name: 'Access'});
        expect(link.getAttribute('href')).toBe('/access');

        fireEvent.click(screen.getByRole('button', {name: 'Access', expanded: true}));
        expect(onToggleMenuGroupCollapsed).toHaveBeenCalledWith('g1');
    });

    it('highlights the group header as current when MenuGroup.current is set', () => {
        const menuGroups: MenuGroup[] = [
            {id: 'g1', title: 'Access', icon: Gear, href: '/access', current: true},
        ];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, groupId: 'g1'},
        ];

        renderBar({items: groupItems, menuGroups, menuOverflow: 'scroll', compact: false});

        const link = screen.getByRole('link', {name: 'Access'});
        expect(link.className).toContain('gn-composite-bar-item_current');
        /* eslint-disable testing-library/no-node-access */
        expect(
            document.querySelector('.gn-composite-bar-item__group-header-row_current'),
        ).not.toBeNull();
        // The root list row must not be selected: only the header row is highlighted.
        expect(document.querySelector('.g-list__item_selected')).toBeNull();
        /* eslint-enable testing-library/no-node-access */
    });

    it('highlights a collapsed clickable group header when its child is current', () => {
        const menuGroups: MenuGroup[] = [{id: 'g1', title: 'Access', icon: Gear, href: '/access'}];
        const groupItems: AsideHeaderItem[] = [
            {id: 'ssh', title: 'SSH Keys', icon: Gear, groupId: 'g1', current: true},
        ];

        renderBar({
            items: groupItems,
            menuGroups,
            menuOverflow: 'scroll',
            compact: false,
            collapsedMenuGroupIds: {g1: true},
        });

        const link = screen.getByRole('link', {name: 'Access'});
        expect(link.className).toContain('gn-composite-bar-item_current');
        /* eslint-disable testing-library/no-node-access */
        expect(
            document.querySelector('.gn-composite-bar-item__group-header-row_current'),
        ).not.toBeNull();
        /* eslint-enable testing-library/no-node-access */
    });
});
