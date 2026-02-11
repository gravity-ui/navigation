import React, {FC, ReactNode} from 'react';

import {createBlock} from '../../../../utils/cn';

import {useScrollbar} from './useScrollbar';

import styles from './ScrollableWithScrollbar.module.scss';

const b = createBlock('scrollable-with-scrollbar', styles);

const EMPTY_DEPS: React.DependencyList = [];

type ScrollableWithScrollbarProps = {
    children: ReactNode;
    className?: string;
    recalcDeps?: React.DependencyList;
};

export const ScrollableWithScrollbar: FC<ScrollableWithScrollbarProps> = ({
    children,
    className,
    recalcDeps = EMPTY_DEPS,
}) => {
    const {
        scrollRef,
        scrollState,
        updateScrollState,
        showScrollbar,
        thumbHeight,
        thumbTop,
        handleThumbMouseDown,
        handleTrackClick,
    } = useScrollbar({recalcDeps});

    return (
        <div className={b({scrollable: true}, className)}>
            <div ref={scrollRef} className={b('scrollable-inner')} onScroll={updateScrollState}>
                {children}
            </div>

            {showScrollbar && (
                <div
                    className={b('scrollbar')}
                    role="scrollbar"
                    aria-valuenow={scrollState.scrollTop}
                    aria-valuemin={0}
                    aria-valuemax={scrollState.scrollHeight - scrollState.clientHeight}
                >
                    <div className={b('scrollbar-track')} onClick={handleTrackClick}>
                        <div
                            className={b('scrollbar-thumb')}
                            style={{
                                height: thumbHeight,
                                transform: `translateY(${thumbTop}px)`,
                            }}
                            onMouseDown={handleThumbMouseDown}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
