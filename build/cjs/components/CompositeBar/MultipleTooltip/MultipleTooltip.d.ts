import React from 'react';
import { PopupProps } from '@gravity-ui/uikit';
import { MenuItem } from '../../types';
import './MultipleTooltip.scss';
export type MultipleTooltipProps = Pick<PopupProps, 'open' | 'anchorRef' | 'placement'> & {
    items: MenuItem[];
};
export declare const MultipleTooltip: React.FC<MultipleTooltipProps>;
