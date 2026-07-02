/**
 * @jest-environment jsdom
 */
import React from 'react';

import {act, render, screen, waitFor} from '@testing-library/react';

import {ScrollableWithScrollbar} from '../ScrollableWithScrollbar';

describe('ScrollableWithScrollbar capped', () => {
    beforeAll(() => {
        class MockResizeObserver {
            private callback: ResizeObserverCallback;

            constructor(callback: ResizeObserverCallback) {
                this.callback = callback;
            }

            observe() {
                this.callback([], this as unknown as ResizeObserver);
            }

            disconnect() {}
        }

        Object.defineProperty(window, 'ResizeObserver', {
            configurable: true,
            writable: true,
            value: MockResizeObserver,
        });
    });

    it('shows a custom scrollbar when capped content overflows', async () => {
        const {container} = render(
            <ScrollableWithScrollbar capped recalcDeps={[10]}>
                {Array.from({length: 10}, (_, index) => (
                    <div key={index} style={{height: 40}}>
                        Item {index + 1}
                    </div>
                ))}
            </ScrollableWithScrollbar>,
        );

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const inner = container.querySelector('[class*="scrollable-inner"]') as HTMLDivElement;

        expect(inner).toBeTruthy();

        Object.defineProperty(inner, 'clientHeight', {configurable: true, value: 165});
        Object.defineProperty(inner, 'scrollHeight', {configurable: true, value: 400});
        inner.scrollTop = 0;

        await act(async () => {
            inner.dispatchEvent(new Event('scroll'));
            await new Promise((resolve) => requestAnimationFrame(resolve));
        });

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeTruthy();
        });

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        expect(container.querySelector('[class*="scrollbar-track"]')).toBeTruthy();
    });

    it('does not render a scrollbar track when capped content fits', async () => {
        const {container} = render(
            <ScrollableWithScrollbar capped recalcDeps={[2]}>
                <div style={{height: 40}}>Item 1</div>
                <div style={{height: 40}}>Item 2</div>
            </ScrollableWithScrollbar>,
        );

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const inner = container.querySelector('[class*="scrollable-inner"]') as HTMLDivElement;

        Object.defineProperty(inner, 'clientHeight', {configurable: true, value: 165});
        Object.defineProperty(inner, 'scrollHeight', {configurable: true, value: 80});

        await act(async () => {
            await new Promise((resolve) => requestAnimationFrame(resolve));
        });

        await waitFor(() => {
            // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
            expect(container.querySelector('[class*="scrollbar-track"]')).toBeNull();
        });
    });
});
