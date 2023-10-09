import React, {useMemo} from 'react';

import {Content} from '../Content';

import {AsideHeaderContextProvider, AsideHeaderInnerContextProvider} from './AsideHeaderContext';
import {AsideHeaderProps} from './types';

import {FirstPanel} from './components';
import {b} from './utils';

import './AsideHeader.scss';
import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../constants';
import {useAsideHeaderInnerContextValue} from './useAsideHeaderInnerContextValue';

export const AsideHeader = React.forwardRef<HTMLDivElement, AsideHeaderProps>((props, ref) => {
    const {className, compact} = props;

    const size = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;
    const asideHeaderContextValue = useMemo(() => ({size, compact}), [compact, size]);
    const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue({...props, size});
    return (
        <AsideHeaderContextProvider value={asideHeaderContextValue}>
            <AsideHeaderInnerContextProvider value={asideHeaderInnerContextValue}>
                <div
                    className={b({compact}, className)}
                    style={{
                        ...({'--gn-aside-header-size': `${size}px`} as React.CSSProperties),
                    }}
                >
                    <div className={b('pane-container')}>
                        {/* First Panel */}
                        <FirstPanel ref={ref} />
                        {/* Second Panel */}
                        <Content
                            size={size}
                            renderContent={props.renderContent}
                            className={b('content')}
                        />
                    </div>
                </div>
            </AsideHeaderInnerContextProvider>
        </AsideHeaderContextProvider>
    );
});
