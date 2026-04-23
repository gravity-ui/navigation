import React, {FC, ReactNode} from 'react';

import {createBlock} from '../../../../utils/cn';

import {useScrollableScrollbarSync} from './useScrollableScrollbarSync';

import styles from './ScrollableWithScrollbar.module.scss';

const b = createBlock('scrollable-with-scrollbar', styles);

const EMPTY_DEPS: React.DependencyList = [];

type ScrollableWithScrollbarProps = {
    children: ReactNode;
    className?: string;
    /**
     * Extra dependencies that should trigger a recalculation of the bottom
     * shadow and custom scrollbar thumb (e.g. when the rendered items change).
     */
    recalcDeps?: React.DependencyList;
};

// Hides the native scrollbar and renders a custom thumb synced with the
// underlying scroll position. The scroll itself stays native (wheel / touch /
// keyboard) — only the visual indicator and drag handling are custom, so the
// reserved gutter width is identical across OS / browser scrollbar settings.
export const ScrollableWithScrollbar: FC<ScrollableWithScrollbarProps> = ({
    children,
    className,
    recalcDeps = EMPTY_DEPS,
}) => {
    const {
        scrollRef,
        thumbRef,
        hasContentBelow,
        overflows,
        thumb,
        isDragging,
        scheduleUpdate,
        handleThumbPointerDown,
        handleTrackPointerDown,
    } = useScrollableScrollbarSync(recalcDeps);

    return (
        <div className={b({'bottom-shadow': hasContentBelow}, className)}>
            <div ref={scrollRef} className={b('scrollable-inner')} onScroll={scheduleUpdate}>
                {children}
            </div>

            {overflows ? (
                <div
                    className={b('scrollbar-track')}
                    onPointerDown={handleTrackPointerDown}
                    aria-hidden="true"
                >
                    <div
                        ref={thumbRef}
                        className={b('scrollbar-thumb', {dragging: isDragging})}
                        style={{transform: `translateY(${thumb.top}px)`, height: thumb.height}}
                        onPointerDown={handleThumbPointerDown}
                    />
                </div>
            ) : null}
        </div>
    );
};
