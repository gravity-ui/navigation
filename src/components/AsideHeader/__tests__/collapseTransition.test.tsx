/**
 * @jest-environment jsdom
 */
import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen} from '@testing-library/react';

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

function ContextProbe() {
    const {compact} = useAsideHeaderContext();
    return <div data-testid="context" data-compact={String(compact)} />;
}

function TestAside({
    initialCompact = false,
    collapseButtonWrapper,
}: {
    initialCompact?: boolean;
    collapseButtonWrapper?: AsideHeaderProps['collapseButtonWrapper'];
}) {
    const [compact, setCompact] = React.useState(initialCompact);
    return (
        <ThemeProvider theme="light">
            <PageLayout compact={compact}>
                <ContextProbe />
                <PageLayoutAside
                    logo={{text: 'Service'}}
                    onChangeCompact={setCompact}
                    collapseTitle="Collapse aside"
                    expandTitle="Expand aside"
                    collapseButtonWrapper={collapseButtonWrapper}
                />
            </PageLayout>
        </ThemeProvider>
    );
}

describe('aside transition target layout', () => {
    it('makes the expanded title available immediately instead of after a timer', () => {
        render(<TestAside initialCompact />);
        expect(screen.queryByText('Service')).toBeNull();
        fireEvent.click(screen.getByTitle('Expand aside'));
        expect(screen.getByText('Service')).toBeTruthy();
        expect(screen.getByTestId('context').getAttribute('data-compact')).toBe('false');
    });

    it('uses the compact target layout immediately when collapsing', () => {
        render(<TestAside />);
        fireEvent.click(screen.getByTitle('Collapse aside'));
        expect(screen.queryByText('Service')).toBeNull();
        expect(screen.getByTestId('context').getAttribute('data-compact')).toBe('true');
    });

    it.each([false, true])('applies rapid reversals from compact=%s', (initialCompact) => {
        render(<TestAside initialCompact={initialCompact} />);
        for (let i = 0; i < 4; i++) {
            const compact = i % 2 === 0 ? initialCompact : !initialCompact;
            fireEvent.click(screen.getByTitle(compact ? 'Expand aside' : 'Collapse aside'));
            expect(screen.getByTestId('context').getAttribute('data-compact')).toBe(
                String(!compact),
            );
        }
    });

    it('passes the target state and callback to custom controls', () => {
        render(
            <TestAside
                collapseButtonWrapper={(_button, {compact, onChangeCompact}) => (
                    <button onClick={() => onChangeCompact?.(!compact)}>
                        {compact ? 'Expand custom' : 'Collapse custom'}
                    </button>
                )}
            />,
        );
        fireEvent.click(screen.getByText('Collapse custom'));
        fireEvent.click(screen.getByText('Expand custom'));
        expect(screen.getByTestId('context').getAttribute('data-compact')).toBe('false');
    });
});
