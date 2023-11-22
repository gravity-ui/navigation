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

    const setAsideTopPanelHeight = React.useCallback((clientHeight: number) => {
        document.documentElement.style.setProperty(
            '--gn-aside-top-panel-height',
            clientHeight + 'px',
        );
    }, []);

    const updateTopSize = React.useCallback(() => {
        if (topRef.current) {
            setAsideTopPanelHeight(topRef.current?.clientHeight || 0);
        }
    }, [topRef, setAsideTopPanelHeight]);

    React.useLayoutEffect(() => {
        const updateTopSizeDebounce = debounceFn(updateTopSize, 200, {leading: true});

        if (topAlert) {
            window.addEventListener('resize', updateTopSizeDebounce);
            updateTopSizeDebounce();
        }
        return () => {
            window.removeEventListener('resize', updateTopSizeDebounce);
            setAsideTopPanelHeight(0);
        };
    }, [topAlert, topHeight, topRef, updateTopSize]);

    return {
        topRef,
        updateTopSize,
    };
};
