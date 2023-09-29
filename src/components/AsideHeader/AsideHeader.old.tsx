import React from 'react';
import debounceFn from 'lodash/debounce';

import {Content} from '../Content';

import {AsideHeaderContextProvider, AsideHeaderInnerContextProvider} from './AsideHeaderContext';
import {AsideHeaderProps} from './types';

import {FirstPanel, TopPanel} from './components';
import {b} from './utils';

import './AsideHeader.scss';
import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../constants';
import {useAsideHeaderInnerContextValue} from './useAsideHeaderInnerContextValue';

export const AsideHeader = React.forwardRef<HTMLDivElement, AsideHeaderProps>((props, ref) => {
    const {className, compact, topAlert} = props;
    const size = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;
    const asideHeaderContextValue = React.useMemo(() => ({size, compact}), [compact, size]);
    const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue({...props, size});

    const topRef = React.useRef<HTMLDivElement>(null);

    const [maxHeightWithTop, setMaxHeightWithTop] = React.useState<string | undefined>();
    const topHeight = topRef.current ? topRef.current.clientHeight : 0;

    React.useLayoutEffect(() => {
        const updateTopSize = debounceFn(
            () => {
                if (topRef.current) {
                    setMaxHeightWithTop(`calc(100vh - ${topRef.current.clientHeight}px)`);
                }
            },
            200,
            {leading: true},
        );
        if (topAlert) {
            window.addEventListener('resize', updateTopSize);
            updateTopSize();
        }
        return () => window.removeEventListener('resize', updateTopSize);
    }, [topAlert, topRef, topHeight]);

    return (
        <AsideHeaderContextProvider value={asideHeaderContextValue}>
            <AsideHeaderInnerContextProvider value={asideHeaderInnerContextValue}>
                <div
                    className={b({compact}, className)}
                    style={{
                        ...({'--gn-aside-header-size': `${size}px`} as React.CSSProperties),
                    }}
                >
                    {/* Top Panel */}
                    {topAlert && <TopPanel ref={topRef} />}
                    <div className={b('pane-container')}>
                        {/* First Panel */}
                        <FirstPanel ref={ref} maxHeight={maxHeightWithTop} />
                        {/* Second Panel */}
                        <Content
                            size={size}
                            maxHeight={maxHeightWithTop}
                            renderContent={props.renderContent}
                            className={b('content')}
                        />
                    </div>
                </div>
            </AsideHeaderInnerContextProvider>
        </AsideHeaderContextProvider>
    );
});
