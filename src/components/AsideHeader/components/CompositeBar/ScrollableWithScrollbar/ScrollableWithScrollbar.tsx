import React, {FC, ReactNode, useCallback, useEffect, useRef, useState} from 'react';

import {createBlock} from '../../../../utils/cn';

import styles from './ScrollableWithScrollbar.module.scss';

const b = createBlock('scrollable-with-scrollbar', styles);

const EMPTY_DEPS: React.DependencyList = [];

type ScrollableWithScrollbarProps = {
    children: ReactNode;
    className?: string;
    /**
     * Extra dependencies that should trigger a bottom-shadow recalculation
     * (e.g. when the rendered items list changes).
     */
    recalcDeps?: React.DependencyList;
};

// Native thin scrollbar + `scrollbar-gutter: stable` (constant gutter) and a
export const ScrollableWithScrollbar: FC<ScrollableWithScrollbarProps> = ({
    children,
    className,
    recalcDeps = EMPTY_DEPS,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [hasContentBelow, setHasContentBelow] = useState(false);

    const rafIdRef = useRef<number | null>(null);
    const scheduleShadowUpdate = useCallback(() => {
        if (rafIdRef.current !== null) {
            return;
        }

        rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;

            const el = scrollRef.current;

            if (!el) {
                return;
            }

            const overflows = el.scrollHeight > el.clientHeight;
            // `-1` guards against subpixel rounding at the bottom of the scroll area.
            const notAtBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
            setHasContentBelow(overflows && notAtBottom);
        });
    }, []);

    useEffect(() => {
        const el = scrollRef.current;

        if (!el) {
            return undefined;
        }

        scheduleShadowUpdate();

        if (typeof ResizeObserver === 'undefined') {
            return undefined;
        }

        const observer = new ResizeObserver(scheduleShadowUpdate);
        observer.observe(el);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduleShadowUpdate, ...recalcDeps]);

    useEffect(() => {
        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };
    }, []);

    return (
        <div className={b({'bottom-shadow': hasContentBelow}, className)}>
            <div ref={scrollRef} className={b('scrollable-inner')} onScroll={scheduleShadowUpdate}>
                {children}
            </div>
        </div>
    );
};
