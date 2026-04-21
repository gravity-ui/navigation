/**
 * @jest-environment jsdom
 */
import {act, renderHook} from '@testing-library/react';

import {useScrollbar} from '../useScrollbar';

// JSDOM does not implement ResizeObserver; provide a no-op.
beforeAll(() => {
    if (typeof (global as {ResizeObserver?: unknown}).ResizeObserver === 'undefined') {
        (global as {ResizeObserver?: unknown}).ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    }
});

function attachElement(
    ref: React.RefObject<HTMLDivElement>,
    {
        scrollHeight,
        clientHeight,
        scrollTop = 0,
    }: {scrollHeight: number; clientHeight: number; scrollTop?: number},
) {
    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollHeight', {configurable: true, value: scrollHeight});
    Object.defineProperty(el, 'clientHeight', {configurable: true, value: clientHeight});
    // scrollTop is writable by default on HTMLElement in jsdom.
    el.scrollTop = scrollTop;
    // getBoundingClientRect used by track-click handler.
    el.getBoundingClientRect = () =>
        ({
            top: 0,
            left: 0,
            right: 0,
            bottom: clientHeight,
            width: 0,
            height: clientHeight,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        }) as DOMRect;
    (ref as {current: HTMLDivElement | null}).current = el;
    return el;
}

describe('useScrollbar', () => {
    it('does not show scrollbar when content fits', () => {
        const {result} = renderHook(() => useScrollbar());
        attachElement(result.current.scrollRef, {scrollHeight: 100, clientHeight: 200});

        act(() => {
            result.current.updateScrollState();
        });

        expect(result.current.showScrollbar).toBe(false);
    });

    it('shows the scrollbar and computes thumb geometry when content overflows', () => {
        const {result} = renderHook(() => useScrollbar());
        attachElement(result.current.scrollRef, {scrollHeight: 400, clientHeight: 100});

        act(() => {
            result.current.updateScrollState();
        });

        expect(result.current.showScrollbar).toBe(true);
        // thumbHeight is clamped by the default minimum (20px).
        expect(result.current.thumbHeight).toBeGreaterThanOrEqual(20);
        expect(result.current.thumbTop).toBe(0);
    });

    it('scrolls via keyboard navigation', () => {
        const {result} = renderHook(() => useScrollbar());
        const el = attachElement(result.current.scrollRef, {
            scrollHeight: 400,
            clientHeight: 100,
        });

        act(() => {
            result.current.updateScrollState();
        });

        const preventDefault = jest.fn();
        act(() => {
            result.current.handleScrollbarKeyDown({
                key: 'End',
                preventDefault,
            } as unknown as React.KeyboardEvent);
        });

        expect(preventDefault).toHaveBeenCalled();
        expect(el.scrollTop).toBe(300);

        act(() => {
            result.current.handleScrollbarKeyDown({
                key: 'Home',
                preventDefault,
            } as unknown as React.KeyboardEvent);
        });
        expect(el.scrollTop).toBe(0);
    });

    it('jumps to the track click position', () => {
        const {result} = renderHook(() => useScrollbar());
        const el = attachElement(result.current.scrollRef, {
            scrollHeight: 400,
            clientHeight: 100,
        });

        act(() => {
            result.current.updateScrollState();
        });

        const div = document.createElement('div');
        div.getBoundingClientRect = () =>
            ({
                top: 0,
                left: 0,
                right: 0,
                bottom: 100,
                width: 0,
                height: 100,
                x: 0,
                y: 0,
                toJSON: () => ({}),
            }) as DOMRect;

        act(() => {
            result.current.handleTrackClick({
                target: div,
                currentTarget: div,
                clientY: 50,
            } as unknown as React.MouseEvent<HTMLDivElement>);
        });

        // maxScroll = 300, ratio = 50/100 -> scrollTop = 150.
        expect(el.scrollTop).toBe(150);
    });
});
