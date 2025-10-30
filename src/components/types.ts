import React, {HTMLAttributeAnchorTarget} from 'react';

import {AlertProps, IconProps, QAProps} from '@gravity-ui/uikit';

import {ItemProps} from './CompositeBar/Item/Item';

export type MenuItemType = 'regular' | 'action' | 'divider';

export type OpenModalSubscriber = (open: boolean) => void;

export interface MakeItemParams {
    icon?: React.ReactNode;
    title: React.ReactNode;
}

export interface MenuItem extends QAProps {
    id: string;
    title: React.ReactNode;
    tooltipText?: React.ReactNode;
    icon?: IconProps['data'];
    iconSize?: number | string;
    iconQa?: string;
    link?: string;
    current?: boolean;
    pinned?: boolean;
    onItemClick?: (
        item: MenuItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    onItemClickCapture?: (event: React.SyntheticEvent) => void;
    onCollapseItemClick?: () => void;
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
    preventUserRemoving?: boolean;
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
    /**
     * The group ID to which the menu item belongs. Used for grouping menu items
     */
    groupId?: string;
    className?: string;
}

export type SubheaderMenuItem = Omit<ItemProps, 'onItemClick' | 'onItemClickCapture'>;

export interface MenuGroup {
    id: string;
    title: string;
    icon?: IconProps['data'];
    order?: number;
    visible?: boolean;
    /** Allow collapsing the group via UI */
    collapsible?: boolean;
    /** Initial collapsed state when collapsible is true */
    collapsedByDefault?: boolean;
}

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
    'aria-label'?: string;
    'aria-labelledby'?: string;
}

export interface TopAlertProps {
    align?: AlertProps['align'];
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
}
