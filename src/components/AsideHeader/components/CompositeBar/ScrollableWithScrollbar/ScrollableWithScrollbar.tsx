import React, {FC, ReactNode, useEffect} from 'react';

import {createBlock} from '../../../../utils/cn';
import {AsideDivider} from '../../AsideDivider';

import {useScrollableScrollbarSync} from './useScrollableScrollbarSync';

import styles from './ScrollableWithScrollbar.module.scss';

const b = createBlock('scrollable-with-scrollbar', styles);

type ScrollableWithScrollbarProps = {
    children: ReactNode;
    className?: string;
    showScrollDividers?: boolean;
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
    showScrollDividers = false,
    onOverflowChange,
}) => {
    const {
        scrollRef,
        trackRef,
        thumbRef,
        overflows,
        canScrollUp,
        canScrollDown,
        thumb,
        scheduleUpdate,
        handleThumbPointerDown,
        handleTrackPointerDown,
    } = useScrollableScrollbarSync();

    useEffect(() => {
        onOverflowChange?.(overflows);
    }, [onOverflowChange, overflows]);

    useEffect(() => {
        return () => onOverflowChange?.(false);
    }, [onOverflowChange]);

    return (
        <div className={b(null, className)}>
            <div
                ref={scrollRef}
                className={b('scrollable-inner')}
                onScroll={scheduleUpdate}
                data-gn-aside-scrollport
            >
                {children}
            </div>

            {showScrollDividers && (
                <React.Fragment>
                    <AsideDivider
                        transitionId="scroll-start"
                        className={b('scroll-divider', {start: true, visible: canScrollUp})}
                    />
                    <AsideDivider
                        transitionId="scroll-end"
                        className={b('scroll-divider', {end: true, visible: canScrollDown})}
                    />
                </React.Fragment>
            )}
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
