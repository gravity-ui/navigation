import React from 'react';
import {IconProps} from '@gravity-ui/uikit';

export type MenuItemType = 'regular' | 'action' | 'divider';

export interface MakeItemParams {
    icon?: React.ReactNode;
    title: React.ReactNode;
}

export interface MenuItem {
    id: string;
    title: React.ReactNode;
    tooltipText?: string;
    icon?: IconProps['data'];
    iconSize?: number | string;
    link?: string;
    current?: boolean;
    pinned?: boolean;
    onItemClick?: (item: MenuItem, collapsed: boolean) => void;
    itemWrapper?: (
        p: MakeItemParams,
        makeItem: (p: MakeItemParams) => React.ReactNode,
        opts: {collapsed: boolean; compact: boolean; item: MenuItem},
    ) => React.ReactNode;
    rightAdornment?: React.ReactNode;
    type?: MenuItemType;
    afterMoreButton?: boolean;
}

export enum Dict {
    ExpandButton = 'button_expand',
    CollapseButton = 'button_collapse',
    MoreButton = 'button_more',
}

export type AsideHeaderDict = Record<Dict, string>;
