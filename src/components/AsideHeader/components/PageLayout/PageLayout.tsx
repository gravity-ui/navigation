import React, {PropsWithChildren, Suspense, useMemo} from 'react';

import {Content, ContentProps} from '../../../Content';
import {
    ASIDE_HEADER_COMPACT_WIDTH,
    ASIDE_HEADER_COMPACT_WIDTH_COMPACT_MODE,
    ASIDE_HEADER_EXPANDED_WIDTH,
} from '../../../constants';
import {TopAlertProps} from '../../../types';
import {AsideHeaderContextProvider, useAsideHeaderContext} from '../../AsideHeaderContext';
import {useIsExpanded} from '../../hooks/useIsExpanded';
import {LayoutProps} from '../../types';
import {b} from '../../utils';

const TopAlert = React.lazy(() =>
    import('../../../TopAlert').then((module) => ({default: module.TopAlert})),
);

// Constants for TopAlert height calculation (in pixels)
const BASE_ALERT_HEIGHT = 60; // Base height of the alert component
const TITLE_HEIGHT_BONUS = 14; // Additional height when title is present
const DENSE_HEIGHT_REDUCTION = 16; // Height reduction when dense mode is enabled

function calcEstimatedTopAlertHeight(topAlert?: TopAlertProps) {
    if (!topAlert || 'render' in topAlert) {
        return 0;
    }

    return (
        BASE_ALERT_HEIGHT +
        (topAlert.title ? TITLE_HEIGHT_BONUS : 0) -
        (topAlert.dense ? DENSE_HEIGHT_REDUCTION : 0)
    );
}

export interface PageLayoutProps extends PropsWithChildren<LayoutProps> {
    onChangePinned?: (pinned: boolean) => void;
    /** When `true`, menu items use compact height. */
    isCompactMode?: boolean;
}

const Layout = ({
    pinned,
    className,
    children,
    topAlert,
    onChangePinned,
    isCompactMode,
}: PageLayoutProps) => {
    const {isExpanded, onExpand, onFold} = useIsExpanded(pinned);

    const collapsedWidth = isCompactMode
        ? ASIDE_HEADER_COMPACT_WIDTH_COMPACT_MODE
        : ASIDE_HEADER_COMPACT_WIDTH;
    const size = isExpanded ? ASIDE_HEADER_EXPANDED_WIDTH : collapsedWidth;

    const asideHeaderContextValue = useMemo(
        () => ({
            size,
            pinned,
            isExpanded,
            onChangePinned,
            onExpand,
            onFold,
        }),
        [size, pinned, isExpanded, onChangePinned, onExpand, onFold],
    );

    const estimatedTopAlertHeight = calcEstimatedTopAlertHeight(topAlert);

    // Reserve margin immediately on server render through inline variable on container.
    // After TopAlert mount, the exact height will be set by hook.
    const getPreloadHeightValue = (): number | undefined => {
        if (!topAlert || 'render' in topAlert || typeof topAlert.preloadHeight === 'undefined') {
            return undefined;
        }

        if (topAlert.preloadHeight === true) {
            return estimatedTopAlertHeight;
        }

        if (typeof topAlert.preloadHeight === 'number') {
            return topAlert.preloadHeight;
        }

        return undefined;
    };

    const preloadHeightValue = getPreloadHeightValue();

    return (
        <AsideHeaderContextProvider value={asideHeaderContextValue}>
            <div
                className={b({collapsed: !isExpanded, 'compact-mode': isCompactMode}, className)}
                style={{
                    ...({'--gn-aside-header-size': `${size}px`} as React.CSSProperties),
                }}
            >
                {typeof preloadHeightValue === 'number' ? (
                    <style
                        dangerouslySetInnerHTML={{
                            __html: `.g-root{--gn-top-alert-height:${preloadHeightValue}px;}`,
                        }}
                    />
                ) : null}
                {topAlert && (
                    <Suspense fallback={null}>
                        <TopAlert className={b('top-alert')} alert={topAlert} />
                    </Suspense>
                )}
                <div className={b('pane-container')}>{children}</div>
            </div>
        </AsideHeaderContextProvider>
    );
};

const ConnectedContent: React.FC<PropsWithChildren<Pick<ContentProps, 'renderContent'>>> = ({
    children,
    renderContent,
}) => {
    const {size, pinned, isExpanded} = useAsideHeaderContext();
    const isExpandedByHover = !pinned && isExpanded;

    return (
        <Content
            size={size}
            className={b('content', {'expanded-by-hover': isExpandedByHover})}
            renderContent={renderContent}
        >
            {children}
        </Content>
    );
};

const PageLayout = Object.assign(Layout, {
    Content: ConnectedContent,
});

export {PageLayout};
