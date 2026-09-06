/**
 * @jest-environment jsdom
 */
import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {act, fireEvent, render, screen} from '@testing-library/react';

import {useAsideHeaderContext} from '../AsideHeaderContext';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';
import {AsideHeaderProps} from '../types';

jest.mock('../i18n');

jest.mock('../../../../assets/icons/control-menu-button.svg', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('../../../../assets/icons/divider-collapsed.svg', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('../components/AllPagesPanel', () => ({
    useVisibleMenuItems: () => [],
    getAllPagesMenuItem: () => ({id: 'all-pages', title: 'All pages'}),
}));

jest.mock('react-virtualized-auto-sizer', () => ({
    __esModule: true,
    default: ({children}: {children: (size: {width: number; height: number}) => React.ReactNode}) =>
        children({width: 240, height: 400}),
}));

const menuItems = [{id: 'home', title: 'Home'}];

function ContextProbe() {
    const {compact, presentationCompact} = useAsideHeaderContext();

    return (
        <div
            data-testid="context"
            data-compact={String(compact)}
            data-presentation-compact={String(presentationCompact)}
        />
    );
}

function TestAside({
    compact,
    onChangeCompact,
    collapseButtonWrapper,
}: {
    compact: boolean;
    onChangeCompact?: (compact: boolean) => void;
    collapseButtonWrapper?: AsideHeaderProps['collapseButtonWrapper'];
}) {
    return (
        <ThemeProvider theme="light">
            <PageLayout compact={compact}>
                <ContextProbe />
                <PageLayoutAside
                    logo={{text: 'Service'}}
                    menuItems={menuItems}
                    onChangeCompact={onChangeCompact}
                    collapseTitle="Collapse aside"
                    expandTitle="Expand aside"
                    collapseButtonWrapper={collapseButtonWrapper}
                />
            </PageLayout>
        </ThemeProvider>
    );
}

// Renders the aside with the compact state applied back from onChangeCompact.
function ControlledAside({
    onCompactChange,
    initialCompact = false,
}: {
    onCompactChange?: (compact: boolean) => void;
    initialCompact?: boolean;
}) {
    const [compact, setCompact] = React.useState(initialCompact);
    const handleCompactChange = React.useCallback(
        (next: boolean) => {
            onCompactChange?.(next);
            setCompact(next);
        },
        [onCompactChange],
    );

    return <TestAside compact={compact} onChangeCompact={handleCompactChange} />;
}

describe('aside collapse transition presentation', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('keeps the expanded presentation until the collapse transition finishes', () => {
        const {rerender} = render(
            <PageLayout compact={false}>
                <ContextProbe />
            </PageLayout>,
        );
        const context = screen.getByTestId('context');

        rerender(
            <PageLayout compact={true}>
                <ContextProbe />
            </PageLayout>,
        );

        // The target state flips immediately...
        expect(context.getAttribute('data-compact')).toBe('true');
        // ...while the rendered presentation stays expanded mid-transition.
        expect(context.getAttribute('data-presentation-compact')).toBe('false');

        act(() => {
            jest.advanceTimersByTime(199);
        });
        expect(context.getAttribute('data-presentation-compact')).toBe('false');

        act(() => {
            jest.advanceTimersByTime(1);
        });
        expect(context.getAttribute('data-presentation-compact')).toBe('true');
    });

    it('keeps the compact presentation until the expand transition finishes', () => {
        const {rerender} = render(
            <PageLayout compact={true}>
                <ContextProbe />
            </PageLayout>,
        );
        const context = screen.getByTestId('context');

        rerender(
            <PageLayout compact={false}>
                <ContextProbe />
            </PageLayout>,
        );

        // The target state flips immediately...
        expect(context.getAttribute('data-compact')).toBe('false');
        // ...while the rendered presentation stays compact mid-transition.
        expect(context.getAttribute('data-presentation-compact')).toBe('true');

        act(() => {
            jest.advanceTimersByTime(199);
        });
        expect(context.getAttribute('data-presentation-compact')).toBe('true');

        act(() => {
            jest.advanceTimersByTime(1);
        });
        expect(context.getAttribute('data-presentation-compact')).toBe('false');
    });

    it('keeps the logo text rendered while the collapse transition runs', () => {
        const {rerender} = render(<TestAside compact={false} />);
        expect(screen.getByText('Service')).toBeTruthy();

        rerender(<TestAside compact={true} />);

        // The shrinking aside clips the frozen expanded layout instead of
        // dropping the logo text on the first animation frame.
        expect(screen.getByText('Service')).toBeTruthy();

        act(() => {
            jest.advanceTimersByTime(200);
        });
        expect(screen.queryByText('Service')).toBeNull();
    });

    it('keeps the logo text hidden until the expand transition finishes', () => {
        const {rerender} = render(<TestAside compact={true} />);
        expect(screen.queryByText('Service')).toBeNull();

        rerender(<TestAside compact={false} />);

        // The widening aside reveals the compact presentation first; the
        // expanded one appears when the aside reaches its final width.
        expect(screen.queryByText('Service')).toBeNull();

        act(() => {
            jest.advanceTimersByTime(200);
        });
        expect(screen.getByText('Service')).toBeTruthy();
    });

    it('keeps the frozen expanded presentation when the collapse is reversed mid-transition', () => {
        const onCompactChange = jest.fn();
        render(<ControlledAside onCompactChange={onCompactChange} />);
        const context = screen.getByTestId('context');

        // Start collapsing.
        fireEvent.click(screen.getByTitle('Collapse aside'));
        expect(onCompactChange).toHaveBeenLastCalledWith(true);
        expect(screen.getByText('Service')).toBeTruthy();

        act(() => {
            jest.advanceTimersByTime(80);
        });

        // Reverse before the transition ends: the held expanded presentation
        // must survive the direction flip instead of snapping to compact.
        fireEvent.click(screen.getByTitle('Collapse aside'));
        expect(onCompactChange).toHaveBeenLastCalledWith(false);
        expect(screen.getByText('Service')).toBeTruthy();

        act(() => {
            jest.advanceTimersByTime(200);
        });

        // The aside settles expanded.
        expect(screen.getByText('Service')).toBeTruthy();
        expect(context.getAttribute('data-compact')).toBe('false');
        expect(context.getAttribute('data-presentation-compact')).toBe('false');
    });

    it('keeps the frozen compact presentation when the expand is reversed mid-transition', () => {
        const onCompactChange = jest.fn();
        render(<ControlledAside initialCompact onCompactChange={onCompactChange} />);
        const context = screen.getByTestId('context');

        // Start expanding.
        fireEvent.click(screen.getByTitle('Expand aside'));
        expect(onCompactChange).toHaveBeenLastCalledWith(false);
        expect(screen.queryByText('Service')).toBeNull();

        act(() => {
            jest.advanceTimersByTime(80);
        });

        // Reverse before the transition ends: the held compact presentation
        // must survive the direction flip instead of snapping to expanded.
        fireEvent.click(screen.getByTitle('Expand aside'));
        expect(onCompactChange).toHaveBeenLastCalledWith(true);
        expect(screen.queryByText('Service')).toBeNull();

        act(() => {
            jest.advanceTimersByTime(200);
        });

        // The aside settles compact.
        expect(screen.queryByText('Service')).toBeNull();
        expect(context.getAttribute('data-compact')).toBe('true');
        expect(context.getAttribute('data-presentation-compact')).toBe('true');
    });
});

describe('collapse button during the width transition', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('reverses the direction when pressed during the collapse transition', () => {
        const onChangeCompact = jest.fn();
        const {rerender} = render(<TestAside compact={false} onChangeCompact={onChangeCompact} />);

        rerender(<TestAside compact={true} onChangeCompact={onChangeCompact} />);
        fireEvent.click(screen.getByTitle('Collapse aside'));

        // The panel is collapsing (target compact): the press must expand it
        // back instead of re-applying the collapse command.
        expect(onChangeCompact).toHaveBeenCalledWith(false);
    });

    it('reverses the direction when pressed during the expand transition', () => {
        const onChangeCompact = jest.fn();
        const {rerender} = render(<TestAside compact={true} onChangeCompact={onChangeCompact} />);

        rerender(<TestAside compact={false} onChangeCompact={onChangeCompact} />);
        fireEvent.click(screen.getByTitle('Expand aside'));

        expect(onChangeCompact).toHaveBeenCalledWith(true);
    });

    it('passes the target compact state to collapseButtonWrapper', () => {
        const onChangeCompact = jest.fn();
        const wrapper = (defaultButton: React.ReactNode, data: {compact: boolean}) => (
            <React.Fragment>
                {defaultButton}
                <button type="button" onClick={() => onChangeCompact(!data.compact)}>
                    {data.compact ? 'wrapper-collapse' : 'wrapper-expand'}
                </button>
            </React.Fragment>
        );
        const {rerender} = render(
            <TestAside
                compact={false}
                onChangeCompact={onChangeCompact}
                collapseButtonWrapper={wrapper}
            />,
        );

        rerender(
            <TestAside
                compact={true}
                onChangeCompact={onChangeCompact}
                collapseButtonWrapper={wrapper}
            />,
        );

        // Mid-collapse the wrapper must see the target state...
        expect(screen.getByText('wrapper-collapse')).toBeTruthy();

        // ...so its standard implementation expands the aside back.
        fireEvent.click(screen.getByText('wrapper-collapse'));
        expect(onChangeCompact).toHaveBeenLastCalledWith(false);
    });

    it('toggles the stable state as before', () => {
        const onChangeCompact = jest.fn();
        render(<TestAside compact={false} onChangeCompact={onChangeCompact} />);

        fireEvent.click(screen.getByTitle('Collapse aside'));

        expect(onChangeCompact).toHaveBeenCalledWith(true);
    });
});
