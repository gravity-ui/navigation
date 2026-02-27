import React, {useCallback, useEffect, useRef, useState} from 'react';

type ScrollbarState = {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
};

type UseScrollbarOptions = {
    recalcDeps?: React.DependencyList;
};

const DEFAULT_SCROLLBAR_THUMB_HEIGHT = 20;

const EMPTY_DEPS: React.DependencyList = [];

export function useScrollbar(options: UseScrollbarOptions = {}) {
    const {recalcDeps = EMPTY_DEPS} = options;
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollState, setScrollState] = useState<ScrollbarState>({
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
    });
    const thumbDragRef = useRef({isDragging: false, startY: 0, startScrollTop: 0});
    const dragCleanupRef = useRef<(() => void) | null>(null);

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;

        if (!el) return;

        setScrollState({
            scrollTop: el.scrollTop,
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight,
        });
    }, []);

    useEffect(() => {
        const el = scrollRef.current;

        if (!el) return;

        updateScrollState();

        const observer = new ResizeObserver(updateScrollState);
        observer.observe(el);

        return () => observer.disconnect();
    }, [updateScrollState, ...recalcDeps]);

    const handleThumbMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();

        if (!scrollRef.current) return;

        thumbDragRef.current = {
            isDragging: true,
            startY: e.clientY,
            startScrollTop: scrollRef.current.scrollTop,
        };

        const onMouseMove = (moveEvent: MouseEvent) => {
            if (!thumbDragRef.current.isDragging || !scrollRef.current) return;
            const {scrollHeight, clientHeight} = scrollRef.current;
            const trackHeight = clientHeight;
            const maxScroll = scrollHeight - clientHeight;

            if (maxScroll <= 0) return;

            const deltaY = moveEvent.clientY - thumbDragRef.current.startY;
            const thumbRatio = trackHeight / scrollHeight;
            const scrollDelta = deltaY / thumbRatio;

            scrollRef.current.scrollTop = Math.min(
                maxScroll,
                Math.max(0, thumbDragRef.current.startScrollTop + scrollDelta),
            );

            thumbDragRef.current.startY = moveEvent.clientY;
            thumbDragRef.current.startScrollTop = scrollRef.current.scrollTop;
        };

        const removeListeners = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            dragCleanupRef.current = null;
        };

        const onMouseUp = () => {
            thumbDragRef.current.isDragging = false;
            removeListeners();
        };

        dragCleanupRef.current = removeListeners;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }, []);

    useEffect(() => {
        return () => {
            dragCleanupRef.current?.();
        };
    }, []);

    const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollRef.current || e.target !== e.currentTarget) return;

        const {scrollHeight, clientHeight} = scrollRef.current;
        const maxScroll = scrollHeight - clientHeight;

        if (maxScroll <= 0) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientY - rect.top) / rect.height;

        scrollRef.current.scrollTop = ratio * maxScroll;
    }, []);

    const handleScrollbarKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            const el = scrollRef.current;
            if (!el) return;

            const {scrollHeight, clientHeight} = el;
            const maxScroll = scrollHeight - clientHeight;
            if (maxScroll <= 0) return;

            const step = Math.max(20, clientHeight * 0.2);
            let newScrollTop = el.scrollTop;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    newScrollTop = Math.min(maxScroll, el.scrollTop + step);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    newScrollTop = Math.max(0, el.scrollTop - step);
                    break;
                case 'End':
                    e.preventDefault();
                    newScrollTop = maxScroll;
                    break;
                case 'Home':
                    e.preventDefault();
                    newScrollTop = 0;
                    break;
                default:
                    return;
            }

            el.scrollTop = newScrollTop;
            updateScrollState();
        },
        [updateScrollState],
    );

    const showScrollbar =
        scrollState.scrollHeight > scrollState.clientHeight && scrollState.scrollHeight > 0;
    const thumbRatio =
        scrollState.scrollHeight > 0 ? scrollState.clientHeight / scrollState.scrollHeight : 0;
    const thumbHeight = Math.max(
        DEFAULT_SCROLLBAR_THUMB_HEIGHT,
        scrollState.clientHeight * thumbRatio,
    );
    const trackHeight = scrollState.clientHeight;
    const thumbMaxTop = trackHeight - thumbHeight;
    const thumbTop =
        trackHeight > thumbHeight && scrollState.scrollHeight > scrollState.clientHeight
            ? (scrollState.scrollTop / (scrollState.scrollHeight - scrollState.clientHeight)) *
              thumbMaxTop
            : 0;

    return {
        scrollRef,
        scrollState,
        updateScrollState,
        showScrollbar,
        thumbHeight,
        thumbTop,
        handleThumbMouseDown,
        handleTrackClick,
        handleScrollbarKeyDown,
    };
}
