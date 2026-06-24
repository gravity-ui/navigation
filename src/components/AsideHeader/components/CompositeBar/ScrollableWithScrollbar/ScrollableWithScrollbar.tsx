import React, {FC, ReactNode, useEffect} from 'react';

import {createBlock} from '../../../../utils/cn';

import {useScrollableScrollbarSync} from './useScrollableScrollbarSync';

import styles from './ScrollableWithScrollbar.module.scss';

const b = createBlock('scrollable-with-scrollbar', styles);

const EMPTY_DEPS: React.DependencyList = [];

type ScrollableWithScrollbarProps = {
    children: ReactNode;
    className?: string;
    /**
     * Extra dependencies that should trigger a recalculation of the custom
     * scrollbar thumb (e.g. when the rendered items change).
     */
    recalcDeps?: React.DependencyList;
    /** Called when scrollable content overflows the allocated height. */
    onOverflowChange?: (overflows: boolean) => void;
};

// Hides the native scrollbar and renders a custom thumb synced with the
// underlying scroll position. The scroll itself stays native (wheel / touch /
// keyboard) — only the visual indicator and drag handling are custom, so the
// reserved gutter width is identical across OS / browser scrollbar settings.
export const ScrollableWithScrollbar: FC<ScrollableWithScrollbarProps> = ({
    children,
    className,
    recalcDeps = EMPTY_DEPS,
    onOverflowChange,
}) => {
    const {
        scrollRef,
        trackRef,
        thumbRef,
        overflows,
        thumb,
        scheduleUpdate,
        handleThumbPointerDown,
        handleTrackPointerDown,
    } = useScrollableScrollbarSync(recalcDeps);

    useEffect(() => {
        onOverflowChange?.(overflows);
    }, [overflows, onOverflowChange]);

    useEffect(() => {
        return () => onOverflowChange?.(false);
    }, [onOverflowChange]);

    return (
        <div className={b(null, className)}>
            <div ref={scrollRef} className={b('scrollable-inner')} onScroll={scheduleUpdate}>
                {children}
            </div>

            {overflows ? (
                <div
                    ref={trackRef}
                    className={b('scrollbar-track')}
                    onPointerDown={handleTrackPointerDown}
                    aria-hidden="true"
                >
                    <div
                        ref={thumbRef}
                        className={b('scrollbar-thumb')}
                        style={{transform: `translateY(${thumb.top}px)`, height: thumb.height}}
                        onPointerDown={handleThumbPointerDown}
                    />
                </div>
            ) : null}
        </div>
    );
};
