import React, {FC, ReactNode, useId} from 'react';

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
    const scrollableContentId = useId();
    const {
        scrollRef,
        scrollState,
        updateScrollState,
        showScrollbar,
        thumbHeight,
        thumbTop,
        handleThumbMouseDown,
        handleTrackClick,
        handleScrollbarKeyDown,
    } = useScrollbar({recalcDeps});

    const hasContentBelow =
        scrollState.scrollHeight > scrollState.clientHeight &&
        scrollState.scrollTop + scrollState.clientHeight < scrollState.scrollHeight - 1;

    return (
        <div className={b({scrollable: true}, className)}>
            <div
                id={scrollableContentId}
                ref={scrollRef}
                className={b('scrollable-inner')}
                onScroll={updateScrollState}
            >
                {children}
            </div>

            {hasContentBelow && <div className={b('bottom-shadow')} aria-hidden />}

            {showScrollbar && (
                <div
                    className={b('scrollbar')}
                    role="scrollbar"
                    aria-controls={scrollableContentId}
                    aria-orientation="vertical"
                    aria-valuenow={scrollState.scrollTop}
                    aria-valuemin={0}
                    aria-valuemax={scrollState.scrollHeight - scrollState.clientHeight}
                    tabIndex={0}
                    onKeyDown={handleScrollbarKeyDown}
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
