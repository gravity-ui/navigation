/**
 * @jest-environment jsdom
 */
import React from 'react';

import {render, screen} from '@testing-library/react';

import {useAsideHeaderContext} from '../AsideHeaderContext';
import {PageLayout} from '../components/PageLayout/PageLayout';

function Probe() {
    const context = useAsideHeaderContext();
    return <output data-testid="context">{JSON.stringify(context)}</output>;
}

test('enables compact transitions by default, including the default context', () => {
    const {rerender} = render(<Probe />);
    expect(JSON.parse(screen.getByTestId('context').textContent ?? '{}')).toMatchObject({
        compactTransition: true,
    });
    rerender(
        <PageLayout compact>
            <Probe />
        </PageLayout>,
    );
    expect(JSON.parse(screen.getByTestId('context').textContent ?? '{}')).toMatchObject({
        compactTransition: true,
    });
});

test('updates context when only compactTransition changes', () => {
    const {rerender} = render(
        <PageLayout {...{compact: false, compactTransition: true}}>
            <Probe />
        </PageLayout>,
    );
    rerender(
        <PageLayout {...{compact: false, compactTransition: false}}>
            <Probe />
        </PageLayout>,
    );
    expect(JSON.parse(screen.getByTestId('context').textContent ?? '{}')).toMatchObject({
        compact: false,
        compactTransition: false,
        size: 236,
    });
    rerender(
        <PageLayout {...{compact: false, compactTransition: true}}>
            <Probe />
        </PageLayout>,
    );
    expect(JSON.parse(screen.getByTestId('context').textContent ?? '{}')).toMatchObject({
        compactTransition: true,
    });
});
