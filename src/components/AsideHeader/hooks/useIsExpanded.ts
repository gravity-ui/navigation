import {useCallback, useEffect, useState} from 'react';

import {useDelayedToggle} from './useDelayedToggle';

const HOVER_DELAY = 150;

export interface UseIsExpandedResult {
    isExpanded: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
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

    const shouldExpand = externalCompact && isMouseInside;
    const delayedShouldExpand = useDelayedToggle(shouldExpand, {
        enableDelay: HOVER_DELAY,
        disableDelay: HOVER_DELAY,
    });

    // Update isExpanded based on hover
    useEffect(() => {
        if (externalCompact) {
            setIsExpanded(delayedShouldExpand);
        }
        // We need to run this effect only when delayedShouldExpand changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delayedShouldExpand]);

    const handleMouseEnter = useCallback(() => {
        setIsMouseInside(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsMouseInside(false);
    }, []);

    return {
        isExpanded,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
    };
};
