import React, {PropsWithChildren, useMemo} from 'react';
import {AsideHeaderContextProvider, useAsideHeaderContext} from '../../AsideHeaderContext';
import {Content, ContentProps} from '../../../Content';
import {TopPanel} from '..';
import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../../../constants';
import {LayoutProps} from '../../types';
import {b} from '../../utils';

import '../../AsideHeader.scss';

export interface PageLayoutProps extends PropsWithChildren<LayoutProps> {
    reverse?: boolean;
}

const Layout = ({
    compact,
    reverse,
    className,
    children,
    topAlert,
    updateTopSize,
    topRef,
}: PageLayoutProps) => {
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
                {topAlert && <TopPanel topAlert={topAlert} onClose={updateTopSize} ref={topRef} />}
                <div className={b('pane-container')}>{children}</div>
            </div>
        </AsideHeaderContextProvider>
    );
};

const ConnectedContent: React.FC<
    PropsWithChildren<Pick<ContentProps, 'renderContent' | 'maxHeight'>>
> = ({children, renderContent, maxHeight}) => {
    const {size} = useAsideHeaderContext();

    return (
        <Content
            size={size}
            className={b('content')}
            renderContent={renderContent}
            maxHeight={maxHeight}
        >
            {children}
        </Content>
    );
};

const PageLayout = Object.assign(Layout, {
    Content: ConnectedContent,
});

export {PageLayout};
