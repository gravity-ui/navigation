import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';

const EMPTY_DEPS: React.DependencyList = [];

const MIN_THUMB_HEIGHT = 24;

type ThumbGeometry = {
    top: number;
    height: number;
};

type UseScrollableScrollbarSyncResult = {
    scrollRef: React.RefObject<HTMLDivElement>;
    trackRef: React.RefObject<HTMLDivElement>;
    thumbRef: React.RefObject<HTMLDivElement>;
    hasContentBelow: boolean;
    overflows: boolean;
    thumb: ThumbGeometry;
    isDragging: boolean;
    scheduleUpdate: () => void;
    handleThumbPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
    handleTrackPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
};

/**
 * Keeps a custom scrollbar thumb and bottom shadow in sync with a native
 * scroll container (wheel / touch / keyboard unchanged).
 *
 * @param recalcDeps - extra deps that should trigger thumb/shadow recalculation
 * @returns refs, scroll state, thumb geometry, and pointer handlers for the UI
 */
export function useScrollableScrollbarSync(
    recalcDeps: React.DependencyList = EMPTY_DEPS,
): UseScrollableScrollbarSyncResult {
    const scrollRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const [hasContentBelow, setHasContentBelow] = useState(false);
    const [overflows, setOverflows] = useState(false);
    const [thumb, setThumb] = useState<ThumbGeometry>({top: 0, height: 0});
    const [isDragging, setIsDragging] = useState(false);

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

            const {scrollTop, scrollHeight, clientHeight} = el;
            const isOverflowing = scrollHeight > clientHeight;
            // `-1` guards against subpixel rounding at the bottom.
            const notAtBottom = scrollTop + clientHeight < scrollHeight - 1;

            setOverflows(isOverflowing);
            setHasContentBelow(isOverflowing && notAtBottom);

            if (!isOverflowing) {
                setThumb({top: 0, height: 0});
                return;
            }

            const ratio = clientHeight / scrollHeight;
            const rawHeight = clientHeight * ratio;
            const height = Math.max(rawHeight, MIN_THUMB_HEIGHT);
            const maxTop = clientHeight - height;
            const scrollRatio =
                scrollHeight - clientHeight > 0 ? scrollTop / (scrollHeight - clientHeight) : 0;
            const top = maxTop * scrollRatio;

            setThumb({top, height});
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
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduleUpdate, ...recalcDeps]);

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

            setIsDragging(true);

            const handlePointerMove = (moveEvent: PointerEvent) => {
                const deltaY = moveEvent.clientY - startY;
                const deltaScroll = (deltaY / maxThumbTop) * maxScrollTop;
                scrollEl.scrollTop = startScrollTop + deltaScroll;
            };

            const handlePointerUp = () => {
                setIsDragging(false);
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
        hasContentBelow,
        overflows,
        thumb,
        isDragging,
        scheduleUpdate,
        handleThumbPointerDown,
        handleTrackPointerDown,
    };
}
