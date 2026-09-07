/**
 * @jest-environment jsdom
 */
import React from 'react';

import {act, fireEvent, render, screen} from '@testing-library/react';

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

    it('reports every overflow transition through onOverflowChange', () => {
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

        const onOverflowChange = jest.fn();
        const {container, unmount} = render(
            <ScrollableWithScrollbar onOverflowChange={onOverflowChange}>
                <div data-testid="content-child">Content</div>
            </ScrollableWithScrollbar>,
        );

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const scrollElement = container.querySelector<HTMLElement>(
            '[class*="scrollable-with-scrollbar__scrollable-inner"]',
        );
        let scrollHeight = 80;

        Object.defineProperties(scrollElement, {
            clientHeight: {configurable: true, get: () => 100},
            scrollHeight: {configurable: true, get: () => scrollHeight},
        });

        // Mounting without overflow reports false.
        act(() => {
            resizeCallback([], {} as ResizeObserver);
            jest.runOnlyPendingTimers();
        });

        // Content (150) grows beyond the client height (100).
        scrollHeight = 150;
        act(() => {
            resizeCallback([], {} as ResizeObserver);
            jest.runOnlyPendingTimers();
        });

        // Content (80) shrinks back below the client height (100).
        scrollHeight = 80;
        act(() => {
            resizeCallback([], {} as ResizeObserver);
            jest.runOnlyPendingTimers();
        });

        // The unmount cleanup effect reports one more false afterwards,
        // so the sequence is asserted before unmount.
        expect(onOverflowChange.mock.calls.map(([overflows]) => overflows)).toEqual([
            false,
            true,
            false,
        ]);

        unmount();
        global.ResizeObserver = originalResizeObserver;
        jest.useRealTimers();
    });

    it('reports overflow changes driven by DOM mutations without a resize callback', async () => {
        jest.useFakeTimers();

        const resizeObserverMock = {callback: undefined as ResizeObserverCallback | undefined};
        let resizeCallbackFired = false;
        const observe = jest.fn();
        const disconnect = jest.fn();
        const originalResizeObserver = global.ResizeObserver;

        global.ResizeObserver = class ResizeObserverMock implements ResizeObserver {
            observe = observe;
            unobserve = jest.fn();
            disconnect = disconnect;

            constructor(callback: ResizeObserverCallback) {
                resizeObserverMock.callback = () => {
                    resizeCallbackFired = true;
                    callback([], {} as ResizeObserver);
                };
            }
        };
        const disconnectMutationObserver = jest.spyOn(MutationObserver.prototype, 'disconnect');

        const onOverflowChange = jest.fn();
        const {container, unmount} = render(
            <ScrollableWithScrollbar onOverflowChange={onOverflowChange}>
                <div data-testid="content-child">Content</div>
            </ScrollableWithScrollbar>,
        );

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const scrollElement = container.querySelector<HTMLElement>(
            '[class*="scrollable-with-scrollbar__scrollable-inner"]',
        );
        let scrollHeight = 80;

        Object.defineProperties(scrollElement, {
            clientHeight: {configurable: true, get: () => 100},
            scrollHeight: {configurable: true, get: () => scrollHeight},
        });
        if (!scrollElement) {
            throw new Error('scrollable element is missing');
        }

        // Settle the measurements scheduled on mount.
        act(() => {
            jest.runOnlyPendingTimers();
        });

        // Content (150) grows beyond the client height (100): a childList mutation
        // must re-measure even though no observed box was resized.
        scrollHeight = 150;
        await act(async () => {
            // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
            scrollElement.appendChild(document.createElement('div'));
            // Let the MutationObserver microtask schedule the re-measure.
            await Promise.resolve();
            jest.runOnlyPendingTimers();
        });

        // Content (80) shrinks back below the client height (100): an attribute
        // mutation (the collapse-mode inline style resize) must reset the state.
        scrollHeight = 80;
        await act(async () => {
            scrollElement.setAttribute('data-test-mutation', 'true');
            await Promise.resolve();
            jest.runOnlyPendingTimers();
        });

        // No ResizeObserver callback is ever invoked: the transitions came from
        // the MutationObserver path alone.
        expect(resizeCallbackFired).toBe(false);
        expect(onOverflowChange.mock.calls.map(([overflows]) => overflows)).toEqual([
            false,
            true,
            false,
        ]);

        unmount();
        expect(disconnectMutationObserver).toHaveBeenCalled();
        disconnectMutationObserver.mockRestore();
        global.ResizeObserver = originalResizeObserver;
        jest.useRealTimers();
    });

    it('ignores sub-pixel overflow at the 1px boundary but reports 2px', () => {
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
        let scrollHeight = 101;

        Object.defineProperties(scrollElement, {
            clientHeight: {configurable: true, get: () => 100},
            scrollHeight: {configurable: true, get: () => scrollHeight},
        });

        const queryScrollbarTrack = () =>
            // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
            container.querySelector('[class*="scrollbar-track"]');

        // scrollHeight (101) exceeds clientHeight (100) by 1px: sub-pixel rounding,
        // not scrollable content — no overflow is reported.
        act(() => {
            resizeCallback([], {} as ResizeObserver);
            jest.runOnlyPendingTimers();
        });
        expect(queryScrollbarTrack()).toBeNull();

        // scrollHeight (102) exceeds clientHeight (100) by 2px: real overflow.
        scrollHeight = 102;
        act(() => {
            resizeCallback([], {} as ResizeObserver);
            jest.runOnlyPendingTimers();
        });
        expect(queryScrollbarTrack()).not.toBeNull();

        unmount();
        global.ResizeObserver = originalResizeObserver;
        jest.useRealTimers();
    });
});

describe('scroll-edge indicators', () => {
    it('tracks both edges with tolerance and mounts indicators only when enabled', () => {
        jest.useFakeTimers();
        const {container, rerender, unmount} = render(
            <ScrollableWithScrollbar>
                <div>Content</div>
            </ScrollableWithScrollbar>,
        );
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const scroll = container.querySelector('[data-gn-aside-scrollport]') as HTMLElement;
        let scrollTop = 0;
        let scrollHeight = 200;
        Object.defineProperties(scroll, {
            clientHeight: {configurable: true, get: () => 100},
            scrollHeight: {configurable: true, get: () => scrollHeight},
            scrollTop: {configurable: true, get: () => scrollTop},
        });
        const indicators = () =>
            // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
            Array.from(container.querySelectorAll('[data-gn-aside-divider]'));
        const update = () => {
            fireEvent.scroll(scroll);
            act(() => {
                jest.runOnlyPendingTimers();
            });
        };
        const visible = () => indicators().map((el) => el.className.includes('visible'));
        expect(indicators()).toHaveLength(0);
        rerender(
            <ScrollableWithScrollbar showScrollDividers>
                <div>Content</div>
            </ScrollableWithScrollbar>,
        );
        update();
        expect(visible()).toEqual([false, true]);
        scrollTop = 1;
        update();
        expect(visible()).toEqual([false, true]);
        scrollTop = 2;
        update();
        expect(visible()).toEqual([true, true]);
        scrollTop = 99;
        update();
        expect(visible()).toEqual([true, false]);
        scrollTop = 100;
        update();
        expect(visible()).toEqual([true, false]);
        scrollHeight = 101;
        update();
        expect(visible()).toEqual([false, false]);
        rerender(
            <ScrollableWithScrollbar>
                <div>Content</div>
            </ScrollableWithScrollbar>,
        );
        expect(indicators()).toHaveLength(0);
        unmount();
        jest.useRealTimers();
    });
});
