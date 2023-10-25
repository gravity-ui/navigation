import React, {PropsWithChildren, useMemo} from 'react';
import {AsideHeaderContextProvider, useAsideHeaderContext} from '../AsideHeaderContext';
import {Content, ContentProps} from '../../Content';
import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../../constants';
import {PageLayoutProps} from '../types';
import {b} from '../utils';

import '../AsideHeader.scss';

const Layout = ({
    compact,
    reverse,
    className,
    children,
}: PropsWithChildren<PageLayoutProps> & {
    reverse?: boolean;
}) => {
    const size = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;
    const asideHeaderContextValue = useMemo(() => ({size, compact}), [compact, size]);

    return (
        <AsideHeaderContextProvider value={asideHeaderContextValue}>
            <div
                className={b({compact, reverse}, className)}
                style={{
                    ...({'--gn-aside-header-size': `${size}px`} as React.CSSProperties),
                }}
            >
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
