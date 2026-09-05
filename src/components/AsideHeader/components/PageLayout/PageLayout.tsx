import React, {PropsWithChildren, Suspense, useMemo} from 'react';

import {Content, ContentProps} from '../../../Content';
import {ASIDE_HEADER_COLLAPSE_TRANSITION_MS} from '../../../constants';
import {TopAlertProps} from '../../../types';
import {AsideHeaderContextProvider, useAsideHeaderContext} from '../../AsideHeaderContext';
import {getAsideHeaderDensityConfig, getAsideHeaderDensityCssProperties} from '../../density';
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

export interface PageLayoutProps extends PropsWithChildren<LayoutProps> {}

/**
 * True while the collapse width transition is running (the aside is shrinking
 * from its expanded width to the compact one). The inner content keeps the
 * expanded presentation during that time and switches to the compact one when
 * the aside has reached its final width: re-fitting titles, the logo text and
 * the item highlight on every animation frame reads as jitter, while the
 * shrinking aside simply clips the frozen expanded layout.
 *
 * @param compact - The current compact state of the aside.
 * @returns Whether the collapse transition is currently running.
 */
function useCollapsingAside(compact: boolean) {
    const [collapsing, setCollapsing] = React.useState(false);
    const previousCompactRef = React.useRef(compact);

    React.useLayoutEffect(() => {
        const wasCompact = previousCompactRef.current;
        previousCompactRef.current = compact;

        if (compact === wasCompact) {
            // The initial render with the compact state already enabled.
            return undefined;
        }

        if (!compact) {
            setCollapsing(false);
            return undefined;
        }

        setCollapsing(true);
        const timer = window.setTimeout(
            () => setCollapsing(false),
            ASIDE_HEADER_COLLAPSE_TRANSITION_MS,
        );

        return () => window.clearTimeout(timer);
    }, [compact]);

    return collapsing;
}

const Layout = ({
    compact,
    className,
    children,
    topAlert,
    menuDensity = 'default',
}: PageLayoutProps) => {
    const densityConfig = getAsideHeaderDensityConfig(menuDensity);
    const densityCssProperties = getAsideHeaderDensityCssProperties(menuDensity);
    const size = compact ? densityConfig.compactWidth : densityConfig.expandedWidth;
    const collapsing = useCollapsingAside(Boolean(compact));
    const presentationCompact = Boolean(compact) && !collapsing;
    const asideHeaderContextValue = useMemo(
        () => ({size, compact: presentationCompact, menuDensity}),
        [presentationCompact, size, menuDensity],
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
                className={b({compact: presentationCompact}, className)}
                style={{
                    ...densityCssProperties,
                    ...({'--gn-aside-header-size': `${size}px`} as React.CSSProperties),
                    // While collapsing, the inner content lays out at the
                    // expanded width (see AsideHeader.module.scss) and the
                    // animating aside clips it.
                    ...(collapsing
                        ? ({
                              '--gn-aside-header-frozen-size': `${densityConfig.expandedWidth}px`,
                          } as React.CSSProperties)
                        : {}),
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
    const {size} = useAsideHeaderContext();

    return (
        <Content size={size} className={b('content')} renderContent={renderContent}>
            {children}
        </Content>
    );
};

const PageLayout = Object.assign(Layout, {
    Content: ConnectedContent,
});

export {PageLayout};
