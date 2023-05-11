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

export type MobileMenuItemType = 'regular' | 'divider';

export interface MobileMenuItem
    extends Omit<
        MenuItem,
        | 'tooltipText'
        | 'pinned'
        | 'rightAdornment'
        | 'afterMoreButton'
        | 'itemWrapper'
        | 'onItemClick'
    > {
    type?: MobileMenuItemType;
    closeMenuOnClick?: boolean;
    onItemClick?: (item: MobileMenuItem) => void;
    itemWrapper?: (node: React.ReactNode, item: MobileMenuItem) => React.ReactNode;
}

export enum Dict {
    ExpandButton = 'button_expand',
    CollapseButton = 'button_collapse',
    MoreButton = 'button_more',
}

export type AsideHeaderDict = Record<Dict, string>;

export interface LogoProps {
    text: (() => React.ReactNode) | string;
    icon?: IconProps['data'];
    iconSrc?: string;
    iconClassName?: string;
    iconSize?: number;
    textSize?: number;
    href?: string;
    wrapper?: (node: React.ReactNode, compact: boolean) => React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
