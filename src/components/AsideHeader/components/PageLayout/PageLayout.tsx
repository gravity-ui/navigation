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
 * While the aside width transition runs, returns the compact state it started
 * from so the inner content keeps the original visual presentation until the
 * aside reaches its final width (re-fitting titles, the logo text and the item
 * highlight on every animation frame reads as jitter). Returns null when the
 * aside is stable.
 *
 * @param compact - The current compact state of the aside.
 * @returns The compact state to render, or null when no transition is running.
 */
function useTransitionPresentation(compact: boolean) {
    const [fromCompact, setFromCompact] = React.useState<boolean | null>(null);
    const previousCompactRef = React.useRef(compact);

    React.useLayoutEffect(() => {
        const wasCompact = previousCompactRef.current;
        previousCompactRef.current = compact;

        if (compact === wasCompact) {
            // The initial render with the compact state already enabled.
            return undefined;
        }

        setFromCompact((current) => {
            // A reversal mid-transition keeps the presentation the transition
            // started from: the visual state must not jump when the target
            // flips back before the animation ends.
            return current === null ? wasCompact : current;
        });
        const timer = window.setTimeout(
            () => setFromCompact(null),
            ASIDE_HEADER_COLLAPSE_TRANSITION_MS,
        );

        return () => window.clearTimeout(timer);
    }, [compact]);

    return fromCompact;
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
    const isCompact = Boolean(compact);
    const size = isCompact ? densityConfig.compactWidth : densityConfig.expandedWidth;
    const transitionFromCompact = useTransitionPresentation(isCompact);
    const presentationCompact = transitionFromCompact ?? isCompact;
    const transitioning = transitionFromCompact !== null;
    // The frozen layout follows the rendered presentation (not the target):
    // a reversed transition keeps the presentation it started from.
    let frozenSize: number | null = null;
    if (transitioning) {
        frozenSize = presentationCompact ? densityConfig.compactWidth : densityConfig.expandedWidth;
    }
    const asideHeaderContextValue = useMemo(
        () => ({size, compact: isCompact, presentationCompact, menuDensity}),
        [isCompact, presentationCompact, size, menuDensity],
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
                className={b(
                    {
                        compact: presentationCompact,
                        // The freeze modifiers follow the rendered presentation:
                        // the frozen expanded layout is wider than the animating
                        // aside (min-width), the frozen compact one is narrower
                        // (max-width).
                        'frozen-compact': transitioning && presentationCompact,
                        'frozen-expanded': transitioning && !presentationCompact,
                    },
                    className,
                )}
                style={{
                    ...densityCssProperties,
                    ...({'--gn-aside-header-size': `${size}px`} as React.CSSProperties),
                    // While the transition runs, the inner content keeps the
                    // layout it had before the toggle (see the frozen-compact /
                    // frozen-expanded modifiers in AsideHeader.module.scss)
                    // and the animating aside clips it.
                    ...(frozenSize === null
                        ? {}
                        : ({
                              '--gn-aside-header-frozen-size': `${frozenSize}px`,
                          } as React.CSSProperties)),
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
