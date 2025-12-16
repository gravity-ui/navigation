import {useCallback, useEffect, useState} from 'react';

import {ASIDE_HEADER_HOVER_DELAY} from '../../constants';

import {useDelayedToggle} from './useDelayedToggle';

export interface UseIsExpandedResult {
    isExpanded: boolean;
    onExpand: () => void;
    onFold: () => void;
}

const EXPAND_DELAY = 250;

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

    const shouldExpand = externalCompact && isMouseInside;
    const delayedShouldExpand = useDelayedToggle(shouldExpand, {
        enableDelay: EXPAND_DELAY,
        disableDelay: ASIDE_HEADER_HOVER_DELAY,
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
