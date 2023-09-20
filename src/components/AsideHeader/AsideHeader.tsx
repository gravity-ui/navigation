import React, {useCallback, useMemo} from 'react';

import {MenuItem} from '../types';

import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../constants';

import {Content} from '../Content';

import {AsideHeaderContextProvider, AsideHeaderInnerContextProvider} from './AsideHeaderContext';
import {AsideHeaderGeneralProps, AsideHeaderDefaultProps, AsideHeaderInnerProps} from './types';

import {FirstPanel} from './components';
import {b} from './utils';

import './AsideHeader.scss';

export interface AsideHeaderProps
    extends AsideHeaderGeneralProps,
        Partial<AsideHeaderDefaultProps> {}

export const AsideHeader = (props: AsideHeaderInnerProps) => {
    const {className, compact, onClosePanel} = props;

    const size = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;

    const onItemClick = useCallback(
        (
            item: MenuItem,
            collapsed: boolean,
            event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        ) => {
            onClosePanel?.();
            item.onItemClick?.(item, collapsed, event);
        },
        [onClosePanel],
    );

    const asideHeaderContextValue = useMemo(() => ({size, compact}), [compact, size]);

    return (
        <AsideHeaderContextProvider value={asideHeaderContextValue}>
            <AsideHeaderInnerContextProvider value={{...props, size, onItemClick}}>
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
