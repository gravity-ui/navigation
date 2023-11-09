import React from 'react';

import debounceFn from 'lodash/debounce';
import {AsideHeaderTopAlertProps} from '../types';

export const useAsideHeaderTopPanel = ({
    topAlert,
}: {
    topAlert?: AsideHeaderTopAlertProps;
}): AsideHeaderTopAlertProps => {
    const topRef = React.useRef<HTMLDivElement>(null);

    const [maxHeight, setMaxHeight] = React.useState<string | undefined>();
    const topHeight = topRef.current ? topRef.current.clientHeight : 0;

    const updateTopSize = React.useCallback(() => {
        if (topRef.current || maxHeight) {
            const clientHeight = topRef.current?.clientHeight || 0;

            setMaxHeight(`calc(100vh - ${clientHeight}px)`);
        }
    }, [maxHeight]);

    const onCloseTopAlert = React.useCallback(() => {
        updateTopSize();
        topAlert?.onCloseTopAlert?.();
    }, [topAlert, updateTopSize]);

    React.useLayoutEffect(() => {
        const updateTopSizeDebounce = debounceFn(updateTopSize, 200, {leading: true});

        if (topAlert) {
            window.addEventListener('resize', updateTopSizeDebounce);
            updateTopSizeDebounce();
        }
        return () => window.removeEventListener('resize', updateTopSizeDebounce);
    }, [topAlert, topRef, topHeight, updateTopSize]);

    return {
        ...(topAlert || {}),
        message: topAlert?.message || '',
        ref: topRef,
        maxHeight,
        onCloseTopAlert,
    };
};
