import React from 'react';

import debounceFn from 'lodash/debounce';

import {TopAlertProps} from '../types';

type TopAlertHeightControls = {
    alertRef: React.RefObject<HTMLDivElement>;
    updateTopSize: () => void;
};

const G_ROOT_CLASS_NAME = 'g-root';

export const useTopAlertHeight = ({alert}: {alert?: TopAlertProps}): TopAlertHeightControls => {
    const alertRef = React.useRef<HTMLDivElement>(null);

    const setAsideTopPanelHeight = React.useCallback((clientHeight: number) => {
        const gRootElement = document
            .getElementsByClassName(G_ROOT_CLASS_NAME)
            .item(0) as HTMLElement | null;
        gRootElement?.style.setProperty('--gn-top-alert-height', clientHeight + 'px');
    }, []);

    const updateTopSize = React.useCallback(() => {
        setAsideTopPanelHeight(alertRef.current?.clientHeight || 0);
    }, [setAsideTopPanelHeight]);

    React.useLayoutEffect(() => {
        const updateTopSizeDebounce = debounceFn(updateTopSize, 200, {leading: true});

        if (alert) {
            window.addEventListener('resize', updateTopSizeDebounce);
            updateTopSizeDebounce();
        }
        return () => {
            window.removeEventListener('resize', updateTopSizeDebounce);
            setAsideTopPanelHeight(0);
        };
    }, [alert, alertRef, updateTopSize, setAsideTopPanelHeight]);

    return {
        alertRef,
        updateTopSize,
    };
};
