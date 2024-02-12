import React, {PropsWithChildren, Suspense, useMemo} from 'react';

import {Content, ContentProps} from '../../../Content';
import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../../../constants';
import {AsideHeaderContextProvider, useAsideHeaderContext} from '../../AsideHeaderContext';
import {LayoutProps} from '../../types';
import {b} from '../../utils';

import '../../AsideHeader.scss';

const TopPanel = React.lazy(() =>
    import('../TopPanel').then((module) => ({default: module.TopPanel})),
);

export interface PageLayoutProps extends PropsWithChildren<LayoutProps> {}

const Layout = ({compact, className, children, topAlert}: PageLayoutProps) => {
    const size = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;
    const asideHeaderContextValue = useMemo(() => ({size, compact}), [compact, size]);

    return (
        <AsideHeaderContextProvider value={asideHeaderContextValue}>
            <div
                className={b({compact}, className)}
                style={{
                    ...({'--gn-aside-header-size': `${size}px`} as React.CSSProperties),
                }}
            >
                {topAlert && (
                    <Suspense fallback={null}>
                        <TopPanel topAlert={topAlert} />
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
