import React, {useMemo} from 'react';

import {Content} from '../Content';

import {AsideHeaderContextProvider, AsideHeaderInnerContextProvider} from './AsideHeaderContext';
import {AsideHeaderProps} from './types';

import {FirstPanel} from './components';
import {b} from './utils';

import './AsideHeader.scss';
import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../constants';
import {useAsideHeaderInnerContextValue} from './useAsideHeaderInnerContextValue';

export const AsideHeader = (props: AsideHeaderProps) => {
    const {className, compact} = props;
    const size = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;
    const asideHeaderContextValue = useMemo(() => ({size, compact}), [compact, size]);
    const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue(props);
    return (
        <AsideHeaderContextProvider value={asideHeaderContextValue}>
            <AsideHeaderInnerContextProvider value={asideHeaderInnerContextValue}>
                <div className={b({compact}, className)}>
                    <div className={b('pane-container')}>
                        {/* First Panel */}
                        <FirstPanel />
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
};
