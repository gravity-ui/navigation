import React, {HTMLAttributeAnchorTarget} from 'react';

import {AlertProps, IconProps} from '@gravity-ui/uikit';

import {ItemProps} from 'src/components/CompositeBar/Item/Item';

export type MenuItemType = 'regular' | 'action' | 'divider';

export type OpenModalSubscriber = (open: boolean) => void;

export interface MakeItemParams {
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
}

export interface MenuItem {
    id: string;
    title: React.ReactNode;
    tooltipText?: React.ReactNode;
    description?: React.ReactNode;
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
    /**
     * Order number. Used to determine the display order in the side menu
     */
    order?: number;
    /**
     * Visibility flag in the side menu
     */
    hidden?: boolean;
    /**
     * The category to which the menu item belongs. Need for grouping in the display/editing mode of all pages
     */
    category?: string;
}

export type SubheaderMenuItem = Omit<ItemProps, 'onItemClick' | 'onItemClickCapture'>;

export interface LogoProps {
    text: (() => React.ReactNode) | string;
    className?: string;
    icon?: IconProps['data'];
    iconSrc?: string;
    iconClassName?: string;
    iconSize?: number;
    textSize?: number;
    href?: string;
    target?: HTMLAttributeAnchorTarget;
    wrapper?: (node: React.ReactNode, compact: boolean) => React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export type AsideHeaderTopAlertProps = {
    message: AlertProps['message'];
    title?: AlertProps['title'];
    icon?: AlertProps['icon'];
    view?: AlertProps['view'];
    theme?: AlertProps['theme'];
    actions?: AlertProps['actions'];
    closable?: boolean;
    centered?: boolean;
    dense?: boolean;
    onCloseTopAlert?: () => void;
};
