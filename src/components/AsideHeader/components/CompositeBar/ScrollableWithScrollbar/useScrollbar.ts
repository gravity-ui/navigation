import {useCallback, useEffect, useRef, useState} from 'react';

export type ScrollbarState = {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
};

export type UseScrollbarOptions = {
    recalcDeps?: React.DependencyList;
};

export function useScrollbar(options: UseScrollbarOptions = {}) {
    const {recalcDeps = []} = options;
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollState, setScrollState] = useState<ScrollbarState>({
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
    });
    const thumbDragRef = useRef({isDragging: false, startY: 0, startScrollTop: 0});

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
        const onMouseUp = () => {
            thumbDragRef.current.isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
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

    const showScrollbar =
        scrollState.scrollHeight > scrollState.clientHeight && scrollState.scrollHeight > 0;
    const thumbRatio =
        scrollState.scrollHeight > 0 ? scrollState.clientHeight / scrollState.scrollHeight : 0;
    const thumbHeight = Math.max(20, scrollState.clientHeight * thumbRatio);
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
    };
}
