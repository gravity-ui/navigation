import {useCallback, useEffect, useState} from 'react';

import {ASIDE_HEADER_EXPAND_DELAY, ASIDE_HEADER_EXPAND_TRANSITION_DELAY} from '../../constants';

import {useDelayedToggle} from './useDelayedToggle';

export interface UseIsExpandedResult {
    isExpanded: boolean;
    onExpand: () => void;
    onFold: () => void;
}

export const useIsExpanded = (externalCompact: boolean): UseIsExpandedResult => {
    const [isExpanded, setIsExpanded] = useState(!externalCompact);
    const [isMouseInside, setIsMouseInside] = useState(false);

    useEffect(() => {
        if (externalCompact && isExpanded) {
            return;
        }

        setIsExpanded(!externalCompact);
        // We need to run this effect only when externalCompact changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [externalCompact]);

    const delayedShouldExpand = useDelayedToggle(isMouseInside, {
        enableDelay: ASIDE_HEADER_EXPAND_DELAY,
        disableDelay: ASIDE_HEADER_EXPAND_TRANSITION_DELAY,
    });

    // Update isExpanded based on hover
    useEffect(() => {
        if (externalCompact) {
            setIsExpanded(delayedShouldExpand);
        }
        // We need to run this effect only when delayedShouldExpand changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delayedShouldExpand]);

    const handleExpand = useCallback(() => {
        setIsMouseInside(true);
    }, []);

    const handleFold = useCallback(() => {
        setIsMouseInside(false);
    }, []);

    return {
        isExpanded,
        onExpand: handleExpand,
        onFold: handleFold,
    };
};
