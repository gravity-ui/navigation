import React from 'react';

import debounceFn from 'lodash/debounce';
import {AsideHeaderTopAlertProps} from '../types';

type AsideHeaderTopPanel = {
    topRef: React.RefObject<HTMLDivElement>;
    updateTopSize: () => void;
};

const useRefHeight = (ref: React.RefObject<HTMLDivElement>) => {
    const [topHeight, setTopHeight] = React.useState(0);
    React.useEffect(() => {
        if (ref.current) {
            const {current} = ref;
            setTopHeight(current.clientHeight);
        }
    }, [ref]);
    return topHeight;
};

export const useAsideHeaderTopPanel = ({
    topAlert,
}: {
    topAlert?: AsideHeaderTopAlertProps;
}): AsideHeaderTopPanel => {
    const topRef = React.useRef<HTMLDivElement>(null);
    const topHeight = useRefHeight(topRef);

    const updateTopSize = React.useCallback(() => {
        if (topRef.current) {
            const clientHeight = topRef.current?.clientHeight || 0;

            document.documentElement.style.setProperty(
                '--gn-aside-top-panel-height',
                clientHeight + 'px',
            );
        }
    }, [topRef]);

    React.useLayoutEffect(() => {
        const updateTopSizeDebounce = debounceFn(updateTopSize, 200, {leading: true});

        if (topAlert) {
            window.addEventListener('resize', updateTopSizeDebounce);
            updateTopSizeDebounce();
        }
        return () => window.removeEventListener('resize', updateTopSizeDebounce);
    }, [topAlert, topHeight, topRef, updateTopSize]);

    return {
        topRef,
        updateTopSize,
    };
};
