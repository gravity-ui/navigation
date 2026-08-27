/**
 * @jest-environment jsdom
 */
import React from 'react';

import {act, render, screen} from '@testing-library/react';

import {ScrollableWithScrollbar} from './ScrollableWithScrollbar';

describe('ScrollableWithScrollbar', () => {
    it('recalculates overflow when the rendered content changes size', () => {
        jest.useFakeTimers();

        let resizeCallback: ResizeObserverCallback = () => {};
        const observe = jest.fn();
        const disconnect = jest.fn();
        const originalResizeObserver = global.ResizeObserver;

        global.ResizeObserver = class ResizeObserverMock implements ResizeObserver {
            observe = observe;
            unobserve = jest.fn();
            disconnect = disconnect;

            constructor(callback: ResizeObserverCallback) {
                resizeCallback = callback;
            }
        };

        const {container, unmount} = render(
            <ScrollableWithScrollbar>
                <div data-testid="content-child">Content</div>
            </ScrollableWithScrollbar>,
        );

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const scrollElement = container.querySelector<HTMLElement>(
            '[class*="scrollable-with-scrollbar__scrollable-inner"]',
        );
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const contentElement = screen.getByTestId('content-child');
        let scrollHeight = 80;

        Object.defineProperties(scrollElement, {
            clientHeight: {configurable: true, get: () => 100},
            scrollHeight: {configurable: true, get: () => scrollHeight},
        });

        expect(observe).toHaveBeenCalledWith(scrollElement);
        expect(observe).toHaveBeenCalledWith(contentElement);

        act(() => {
            resizeCallback([], {} as ResizeObserver);
            jest.runOnlyPendingTimers();
        });
        expect(screen.queryByRole('presentation')).toBeNull();

        scrollHeight = 150;
        act(() => {
            resizeCallback([], {} as ResizeObserver);
            jest.runOnlyPendingTimers();
        });

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        expect(container.querySelector('[class*="scrollbar-track"]')).toBeTruthy();

        unmount();
        expect(disconnect).toHaveBeenCalled();
        global.ResizeObserver = originalResizeObserver;
        jest.useRealTimers();
    });
});
