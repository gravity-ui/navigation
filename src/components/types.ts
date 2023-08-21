import React from 'react';
import {IconProps} from '@gravity-ui/uikit';

import {ItemProps} from 'src/components/CompositeBar/Item/Item';

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
    onItemClick?: (
        item: MenuItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => void;
    onItemClickCapture?: (event: React.SyntheticEvent) => void;
    itemWrapper?: (
        p: MakeItemParams,
        makeItem: (p: MakeItemParams) => React.ReactNode,
        opts: {
            collapsed: boolean;
            compact: boolean;
            item: MenuItem;
            ref: React.RefObject<HTMLElement>;
        },
    ) => React.ReactNode;
    rightAdornment?: React.ReactNode;
    type?: MenuItemType;
    afterMoreButton?: boolean;
}

export type SubheaderMenuItem = Omit<ItemProps, 'onItemClick' | 'onItemClickCapture'>;

export enum MobileHeaderDict {
    CloseBurger = 'button_close-burger',
    OpenBurger = 'button_open-burger',
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
