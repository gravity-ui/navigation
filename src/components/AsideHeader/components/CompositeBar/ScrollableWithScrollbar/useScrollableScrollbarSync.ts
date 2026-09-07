import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';

const MIN_THUMB_HEIGHT = 24;

/**
 * A fractional container height can make the integer scrollHeight exceed clientHeight
 * by this many pixels. Such a delta is sub-pixel rounding, not meaningfully scrollable
 * content, so it is not reported as overflow.
 */
const SUBPIXEL_OVERFLOW_PX = 1;

type ThumbGeometry = {
    top: number;
    height: number;
};

type UseScrollableScrollbarSyncResult = {
    scrollRef: React.RefObject<HTMLDivElement>;
    trackRef: React.RefObject<HTMLDivElement>;
    thumbRef: React.RefObject<HTMLDivElement>;
    overflows: boolean;
    canScrollUp: boolean;
    canScrollDown: boolean;
    thumb: ThumbGeometry;
    scheduleUpdate: () => void;
    handleThumbPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
    handleTrackPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
};

/**
 * Keeps a custom scrollbar thumb in sync with a native scroll layer. The
 * scroll element handles touch/keyboard; wheel events on the overlay track are
 * forwarded to it (the track sits above the scroller, so they would not scroll
 * otherwise). Wheel, touch, and keyboard on the scrollable area itself are
 * unchanged.
 *
 * @returns refs, scroll state, thumb geometry, and pointer handlers for the UI
 */
export function useScrollableScrollbarSync(): UseScrollableScrollbarSyncResult {
    const scrollRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const [overflows, setOverflows] = useState(false);
    const [geometry, setGeometry] = useState({
        thumb: {top: 0, height: 0} as ThumbGeometry,
        canScrollUp: false,
        canScrollDown: false,
    });

    const rafIdRef = useRef<number | null>(null);
    const scheduleUpdate = useCallback(() => {
        if (rafIdRef.current !== null) {
            return;
        }

        rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;

            const el = scrollRef.current;

            if (!el) {
                return;
            }

            const {scrollHeight, clientHeight} = el;
            const isOverflowing = scrollHeight - clientHeight > SUBPIXEL_OVERFLOW_PX;

            setOverflows(isOverflowing);

            if (!isOverflowing) {
                setGeometry({thumb: {top: 0, height: 0}, canScrollUp: false, canScrollDown: false});
                return;
            }

            const ratio = clientHeight / scrollHeight;
            const rawHeight = clientHeight * ratio;
            const height = Math.max(rawHeight, MIN_THUMB_HEIGHT);
            const maxTop = clientHeight - height;
            const {scrollTop} = el;
            const scrollRatio =
                scrollHeight - clientHeight > 0 ? scrollTop / (scrollHeight - clientHeight) : 0;
            const top = maxTop * scrollRatio;

            setGeometry({
                thumb: {top, height},
                canScrollUp: isOverflowing && scrollTop > SUBPIXEL_OVERFLOW_PX,
                canScrollDown:
                    isOverflowing && scrollHeight - clientHeight - scrollTop > SUBPIXEL_OVERFLOW_PX,
            });
        });
    }, []);

    useEffect(() => {
        const el = scrollRef.current;

        if (!el) {
            return undefined;
        }

        scheduleUpdate();

        if (typeof ResizeObserver === 'undefined') {
            return undefined;
        }

        const observer = new ResizeObserver(scheduleUpdate);
        observer.observe(el);
        // Observe the direct content child as well: its content-box changes whenever
        // the rendered content changes (rows, titles, adornments, groups, density).
        const contentEl = el.firstElementChild;
        if (contentEl) {
            observer.observe(contentEl);
        }

        // Content can also change without resizing any observed box: the collapse-mode
        // menu resizes its content wrapper via an inline style (AutoSizer), which
        // changes scrollHeight while every observed box stays the same, leaving the
        // overflow state stale. Re-measure on content mutations too (rAF-throttled
        // by scheduleUpdate).
        const mutationObserver = new MutationObserver(scheduleUpdate);
        mutationObserver.observe(el, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
        });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, [scheduleUpdate]);

    useEffect(() => {
        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };
    }, []);

    // Wheel events do not reach the native scroll layer when the cursor is over
    // the overlay track — forward them explicitly. `passive: false` is required
    // so `preventDefault` works in all browsers.
    useLayoutEffect(() => {
        if (!overflows) {
            return undefined;
        }

        const track = trackRef.current;
        const scrollEl = scrollRef.current;

        if (!track || !scrollEl) {
            return undefined;
        }

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            scrollEl.scrollTop += e.deltaY;
        };

        track.addEventListener('wheel', onWheel, {passive: false});
        return () => track.removeEventListener('wheel', onWheel);
    }, [overflows]);

    const cancelProgrammaticSmoothScroll = useCallback((scrollEl: HTMLDivElement) => {
        const top = scrollEl.scrollTop;
        scrollEl.scrollTo({top, behavior: 'auto'});
    }, []);

    const handleThumbPointerDown = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            const scrollEl = scrollRef.current;
            const thumbEl = thumbRef.current;

            if (!scrollEl || !thumbEl || event.button !== 0) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            cancelProgrammaticSmoothScroll(scrollEl);

            const startY = event.clientY;
            const startScrollTop = scrollEl.scrollTop;
            const {scrollHeight, clientHeight} = scrollEl;
            const thumbHeight = thumbEl.getBoundingClientRect().height;
            const trackHeight = clientHeight;
            const maxThumbTop = trackHeight - thumbHeight;
            const maxScrollTop = scrollHeight - clientHeight;

            if (maxThumbTop <= 0 || maxScrollTop <= 0) {
                return;
            }

            const handlePointerMove = (moveEvent: PointerEvent) => {
                const deltaY = moveEvent.clientY - startY;
                const deltaScroll = (deltaY / maxThumbTop) * maxScrollTop;
                scrollEl.scrollTop = startScrollTop + deltaScroll;
            };

            const handlePointerUp = () => {
                window.removeEventListener('pointermove', handlePointerMove);
                window.removeEventListener('pointerup', handlePointerUp);
                window.removeEventListener('pointercancel', handlePointerUp);
            };

            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
            window.addEventListener('pointercancel', handlePointerUp);
        },
        [cancelProgrammaticSmoothScroll],
    );

    const handleTrackPointerDown = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            const scrollEl = scrollRef.current;
            const thumbEl = thumbRef.current;

            if (
                !scrollEl ||
                !thumbEl ||
                event.button !== 0 ||
                event.target !== event.currentTarget
            ) {
                return;
            }

            cancelProgrammaticSmoothScroll(scrollEl);

            const trackRect = event.currentTarget.getBoundingClientRect();
            const thumbHeight = thumbEl.getBoundingClientRect().height;
            const clickY = event.clientY - trackRect.top;
            const targetThumbTop = Math.max(
                0,
                Math.min(clickY - thumbHeight / 2, trackRect.height - thumbHeight),
            );
            const maxThumbTop = trackRect.height - thumbHeight;
            const maxScrollTop = scrollEl.scrollHeight - scrollEl.clientHeight;

            if (maxThumbTop <= 0 || maxScrollTop <= 0) {
                return;
            }

            // `auto` avoids racing with a subsequent thumb drag (smooth scroll would
            // still animate while pointer handlers update `scrollTop`).
            scrollEl.scrollTo({
                top: (targetThumbTop / maxThumbTop) * maxScrollTop,
                behavior: 'auto',
            });
        },
        [cancelProgrammaticSmoothScroll],
    );

    return {
        scrollRef,
        trackRef,
        thumbRef,
        overflows,
        ...geometry,
        scheduleUpdate,
        handleThumbPointerDown,
        handleTrackPointerDown,
    };
}
