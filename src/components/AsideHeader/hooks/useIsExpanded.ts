import {useCallback, useEffect, useRef, useState} from 'react';

import {ASIDE_HEADER_EXPAND_DELAY, ASIDE_HEADER_EXPAND_TRANSITION_DELAY} from '../../constants';
import {SetCollapseBlocker} from '../types';

import {useDelayedToggle} from './useDelayedToggle';

interface UseIsExpandedResult {
    isExpanded: boolean;
    onExpand: () => void;
    onFold: () => void;
    setCollapseBlocker: SetCollapseBlocker;
}

export const useIsExpanded = (externalPinned: boolean): UseIsExpandedResult => {
    const [isExpanded, setIsExpanded] = useState(externalPinned);
    const [isMouseInside, setIsMouseInside] = useState(false);
    const collapseBlockerCountRef = useRef(0);
    const pendingFoldRef = useRef(false);

    useEffect(() => {
        if (!externalPinned && isExpanded) {
            return;
        }

        setIsExpanded(externalPinned);
        // We need to run this effect only when externalPinned changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [externalPinned]);

    const delayedShouldExpand = useDelayedToggle(isMouseInside, {
        enableDelay: ASIDE_HEADER_EXPAND_DELAY,
        disableDelay: ASIDE_HEADER_EXPAND_TRANSITION_DELAY,
    });

    // Update isExpanded based on hover
    useEffect(() => {
        if (!externalPinned) {
            setIsExpanded(delayedShouldExpand);
        }
        // We need to run this effect only when delayedShouldExpand changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delayedShouldExpand]);

    const performFold = useCallback(() => {
        setIsMouseInside(false);
    }, []);

    const handleExpand = useCallback(() => {
        pendingFoldRef.current = false;

        setIsMouseInside(true);
    }, []);

    const handleFold = useCallback(() => {
        if (collapseBlockerCountRef.current > 0) {
            pendingFoldRef.current = true;

            return;
        }

        performFold();
    }, [performFold]);

    const setCollapseBlocker = useCallback(
        (isBlocked: boolean) => {
            if (isBlocked) {
                collapseBlockerCountRef.current += 1;
            } else if (collapseBlockerCountRef.current > 0) {
                collapseBlockerCountRef.current -= 1;

                if (collapseBlockerCountRef.current === 0 && pendingFoldRef.current) {
                    pendingFoldRef.current = false;
                    performFold();
                }
            }
        },
        [performFold],
    );

    return {
        isExpanded,
        onExpand: handleExpand,
        onFold: handleFold,
        setCollapseBlocker,
    };
};
