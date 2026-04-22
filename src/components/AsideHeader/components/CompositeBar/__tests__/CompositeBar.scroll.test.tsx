/**
 * @jest-environment jsdom
 */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen} from '@testing-library/react';

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
    menuItems: [],
    allPagesIsAvailable: false,
    onItemClick: () => {},
} as any;

function renderBar(props: {
    items: AsideHeaderItem[];
    onItemClick?: jest.Mock;
    onMoreClick?: jest.Mock;
    menuOverflow?: AsideHeaderMenuOverflow;
    compact?: boolean;
    menuMoreTitle?: string;
}) {
    return render(
        <ThemeProvider theme="light">
            <AsideHeaderInnerContextProvider value={contextValue}>
                <CompositeBar
                    type="menu"
                    items={props.items}
                    compact={props.compact ?? false}
                    onItemClick={props.onItemClick ?? jest.fn()}
                    onMoreClick={props.onMoreClick}
                    menuMoreTitle={props.menuMoreTitle ?? 'More'}
                    menuOverflow={props.menuOverflow ?? 'scroll'}
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
});
