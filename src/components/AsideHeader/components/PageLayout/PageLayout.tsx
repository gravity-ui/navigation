import React, {PropsWithChildren, Suspense, useMemo} from 'react';

import {Content, ContentProps} from '../../../Content';
import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../../../constants';
import {TopAlertProps} from '../../../types';
import {AsideHeaderContextProvider, useAsideHeaderContext} from '../../AsideHeaderContext';
import {LayoutProps} from '../../types';
import {b} from '../../utils';

const TopAlert = React.lazy(() =>
    import('../../../TopAlert').then((module) => ({default: module.TopAlert})),
);

function calcEstimatedTopAlertHeight(topAlert?: TopAlertProps) {
    if (!topAlert) {
        return 0;
    }

    return 60 + (topAlert.title ? 14 : 0) - (topAlert.dense ? 16 : 0);
}

export interface PageLayoutProps extends PropsWithChildren<LayoutProps> {}

const Layout = ({compact, className, children, topAlert}: PageLayoutProps) => {
    const size = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;
    const asideHeaderContextValue = useMemo(() => ({size, compact}), [compact, size]);

    const estimatedTopAlertHeight = calcEstimatedTopAlertHeight(topAlert);

    // Reserve margin immediately on server render through inline variable on container.
    // After TopAlert mount, the exact height will be set by hook.
    const preloadHeightValue =
        topAlert && typeof topAlert.preloadHeight !== 'undefined'
            ? topAlert.preloadHeight === true
                ? estimatedTopAlertHeight
                : typeof topAlert.preloadHeight === 'number'
                  ? topAlert.preloadHeight
                  : undefined
            : undefined;

    return (
        <AsideHeaderContextProvider value={asideHeaderContextValue}>
            <div
                className={b({compact}, className)}
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
