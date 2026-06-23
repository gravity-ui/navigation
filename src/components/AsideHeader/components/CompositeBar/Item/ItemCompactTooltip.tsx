import React from 'react';

import {PopupProps, Tooltip} from '@gravity-ui/uikit';

import {createBlock} from '../../../../utils/cn';
import {useAsideHeaderContext} from '../../../AsideHeaderContext';
import {getAsideHeaderDensityConfig} from '../../../density';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

const TOOLTIP_MAIN_AXIS_OFFSET = 14;

const TOOLTIP_OPEN_DELAY = 0;
const TOOLTIP_CLOSE_DELAY = 0;

interface Props {
    content: React.ReactNode;
    disabled?: boolean;
    type?: string;
    children: React.ReactElement;
}

export const ItemCompactTooltip: React.FC<Props> = ({content, disabled, type, children}) => {
    const {menuDensity} = useAsideHeaderContext();
    const {itemHeight} = getAsideHeaderDensityConfig(menuDensity);

    const offset = React.useMemo<NonNullable<PopupProps['offset']>>(
        () => ({mainAxis: TOOLTIP_MAIN_AXIS_OFFSET}),
        [],
    );

    const tooltipStyle = React.useMemo(
        () =>
            ({
                '--_--compact-tooltip-height': `${itemHeight}px`,
            }) as React.CSSProperties,
        [itemHeight],
    );

    return (
        <Tooltip
            content={content}
            disabled={disabled}
            placement="right"
            strategy="fixed"
            openDelay={TOOLTIP_OPEN_DELAY}
            closeDelay={TOOLTIP_CLOSE_DELAY}
            offset={offset}
            className={b('icon-tooltip', {'item-type': type})}
            style={tooltipStyle}
        >
            {children}
        </Tooltip>
    );
};

ItemCompactTooltip.displayName = 'ItemCompactTooltip';
