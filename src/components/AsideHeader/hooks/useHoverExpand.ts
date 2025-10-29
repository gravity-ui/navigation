import {useCallback, useEffect, useRef, useState} from 'react';

import {useDelayedToggle} from './useDelayedToggle';

const HOVER_EXPAND_DELAY = 200;
const HOVER_COLLAPSE_DELAY = 300;

export interface UseHoverExpandOptions {
    compact: boolean;
    onChangeCompact?: (compact: boolean) => void;
    isPinned: boolean;
}

export interface UseHoverExpandResult {
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
}

export const useHoverExpand = ({
    compact: expandedCompact,
    isPinned,
    onChangeCompact,
}: UseHoverExpandOptions): UseHoverExpandResult => {
    const [wasExpandedByHover, setWasExpandedByHover] = useState(false);
    const [initialCompact, setInitialCompact] = useState(expandedCompact);
    const [isMouseInside, setIsMouseInside] = useState(false);
    const isExpandingByHoverRef = useRef(false);
    const prevIsPinnedRef = useRef(isPinned);

    const shouldExpand = !isPinned && isMouseInside && initialCompact === true;
    const delayedShouldExpand = useDelayedToggle(shouldExpand, {
        enableDelay: HOVER_EXPAND_DELAY,
        disableDelay: HOVER_COLLAPSE_DELAY,
    });

    const shouldCollapseInitiallyExpanded =
        !isPinned && !isMouseInside && initialCompact === false && !expandedCompact;
    const delayedShouldCollapseInitiallyExpanded = useDelayedToggle(
        shouldCollapseInitiallyExpanded,
        {
            enableDelay: HOVER_EXPAND_DELAY,
            disableDelay: HOVER_COLLAPSE_DELAY,
        },
    );

    // Sync states when compact or pinned state changes externally
    useEffect(() => {
        // Reset hover expansion flag when pinning
        if (isPinned && !prevIsPinnedRef.current) {
            setWasExpandedByHover(false);
        }
        prevIsPinnedRef.current = isPinned;

        // Update initial compact state when changed externally (not by hover)
        if (!isExpandingByHoverRef.current && !isPinned) {
            setInitialCompact(expandedCompact);
            setWasExpandedByHover(false);
        }
        isExpandingByHoverRef.current = false;
    }, [expandedCompact, isPinned]);

    useEffect(() => {
        if (!onChangeCompact || isPinned) {
            return;
        }

        const shouldExpandNow = delayedShouldExpand && expandedCompact && initialCompact === true;
        const shouldCollapseAfterHover =
            !delayedShouldExpand && !expandedCompact && wasExpandedByHover;
        const shouldCollapseInitiallyExpandedNow =
            delayedShouldCollapseInitiallyExpanded && !expandedCompact && initialCompact === false;

        if (shouldExpandNow) {
            isExpandingByHoverRef.current = true;
            setWasExpandedByHover(true);
            onChangeCompact(false);
        } else if (shouldCollapseAfterHover) {
            setWasExpandedByHover(false);
            onChangeCompact(true);
        } else if (shouldCollapseInitiallyExpandedNow) {
            onChangeCompact(true);
        }
    }, [
        delayedShouldExpand,
        delayedShouldCollapseInitiallyExpanded,
        expandedCompact,
        onChangeCompact,
        isPinned,
        initialCompact,
        wasExpandedByHover,
    ]);

    const handleMouseEnter = useCallback(() => {
        setIsMouseInside(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsMouseInside(false);
    }, []);

    return {
        handleMouseEnter,
        handleMouseLeave,
    };
};
