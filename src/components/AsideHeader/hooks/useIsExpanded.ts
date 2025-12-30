import {useCallback, useEffect, useState} from 'react';

import {ASIDE_HEADER_EXPAND_DELAY, ASIDE_HEADER_EXPAND_TRANSITION_DELAY} from '../../constants';

import {useDelayedToggle} from './useDelayedToggle';

interface UseIsExpandedResult {
    isExpanded: boolean;
    onExpand: () => void;
    onFold: () => void;
}

export const useIsExpanded = (externalPinned: boolean): UseIsExpandedResult => {
    const [isExpanded, setIsExpanded] = useState(externalPinned);
    const [isMouseInside, setIsMouseInside] = useState(false);

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
