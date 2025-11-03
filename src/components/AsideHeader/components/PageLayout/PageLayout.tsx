import React, {PropsWithChildren, Suspense, useMemo} from 'react';

import {Content, ContentProps} from '../../../Content';
import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../../../constants';
import {AsideHeaderContextProvider, useAsideHeaderContext} from '../../AsideHeaderContext';
import {useIsExpanded} from '../../hooks/useIsExpanded';
import {LayoutProps} from '../../types';
import {b} from '../../utils';

import '../../AsideHeader.scss';

const TopAlert = React.lazy(() =>
    import('../../../TopAlert').then((module) => ({default: module.TopAlert})),
);

export interface PageLayoutProps extends PropsWithChildren<LayoutProps> {
    onChangeCompact?: (compact: boolean) => void;
}

const Layout = ({compact, className, children, topAlert, onChangeCompact}: PageLayoutProps) => {
    const {isExpanded, handleMouseEnter, handleMouseLeave} = useIsExpanded(compact);

    const size = isExpanded ? ASIDE_HEADER_EXPANDED_WIDTH : ASIDE_HEADER_COMPACT_WIDTH;

    const asideHeaderContextValue = useMemo(
        () => ({
            size,
            compact,
            isExpanded,
            onChangeCompact,
            handleMouseEnter,
            handleMouseLeave,
        }),
        [size, compact, isExpanded, onChangeCompact, handleMouseEnter, handleMouseLeave],
    );

    return (
        <AsideHeaderContextProvider value={asideHeaderContextValue}>
            <div
                className={b({compact: !isExpanded}, className)}
                style={{
                    ...({'--gn-aside-header-size': `${size}px`} as React.CSSProperties),
                }}
            >
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
