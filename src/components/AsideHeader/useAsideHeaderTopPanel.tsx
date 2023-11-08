import React from 'react';

import debounceFn from 'lodash/debounce';
import {AsideHeaderTopAlertProps} from '../types';

export const useAsideHeaderTopPanel = ({topAlert}: {topAlert?: AsideHeaderTopAlertProps}) => {
    const topRef = React.useRef<HTMLDivElement>(null);

    const [maxHeightWithTop, setMaxHeightWithTop] = React.useState<string | undefined>();
    const topHeight = topRef.current ? topRef.current.clientHeight : 0;

    const updateTopSize = React.useCallback(() => {
        if (topRef.current || maxHeightWithTop) {
            const clientHeight = topRef.current?.clientHeight || 0;

            setMaxHeightWithTop(`calc(100vh - ${clientHeight}px)`);
        }
    }, [maxHeightWithTop]);

    React.useLayoutEffect(() => {
        const updateTopSizeDebounce = debounceFn(updateTopSize, 200, {leading: true});

        if (topAlert) {
            window.addEventListener('resize', updateTopSizeDebounce);
            updateTopSizeDebounce();
        }
        return () => window.removeEventListener('resize', updateTopSizeDebounce);
    }, [topAlert, topRef, topHeight, updateTopSize]);

    return {
        topRef,
        maxHeightWithTop,
        updateTopSize,
    };
};
