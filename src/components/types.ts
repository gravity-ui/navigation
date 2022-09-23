import React from 'react';
import {IconProps} from '@gravity-ui/uikit';

export type MenuItemType = 'regular' | 'action';

export interface MenuItem {
    id: string;
    title: string;
    tooltipText?: string;
    icon?: IconProps['data'];
    iconSize?: number | string;
    link?: string;
    current?: boolean;
    pinned?: boolean;
    onItemClick?: (item: MenuItem, collapsed: boolean) => void;
    itemWrapper?: (
        node: React.ReactNode,
        item: MenuItem,
        collapsed: boolean,
        compact: boolean,
    ) => React.ReactNode;
    rightAdornment?: React.ReactNode;
    type?: MenuItemType;
    afterMoreButton?: boolean;
}
