import React, {HTMLAttributeAnchorTarget} from 'react';

import {AlertProps, IconProps, QAProps} from '@gravity-ui/uikit';

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
    href?: string;
    current?: boolean;
    onItemClick?: (
        item: MenuItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    onItemClickCapture?: (event: React.SyntheticEvent) => void;
    itemWrapper?: (
        p: MakeItemParams,
        makeItem: (p: MakeItemParams) => React.ReactNode,
        opts: {
            collapsed: boolean;
            pinned: boolean;
            item: MenuItem;
            ref: React.RefObject<HTMLElement>;
        },
    ) => React.ReactNode;
    preventUserRemoving?: boolean;
    rightAdornment?: React.ReactNode;
    type?: MenuItemType;
    /**
     * Visibility flag in the side menu
     */
    hidden?: boolean;
    /**
     * The group ID to which the menu item belongs. Used for grouping menu items
     */
    groupId?: string;
    className?: string;
}

export interface MenuGroup {
    id: string;
    title: string;
    icon?: IconProps['data'];
    /** Hide the group from display */
    hidden?: boolean;
    /** Allow collapsing the group via UI */
    collapsible?: boolean;
    /** Initial collapsed state when collapsible is true */
    collapsedByDefault?: boolean;
    /** Current collapsed state */
    collapsed: boolean;
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
    /** Wrapper function for the logo. The `isExpanded` parameter indicates if the navigation is expanded. */
    wrapper?: (node: React.ReactNode, isExpanded: boolean) => React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}

interface TopAlertBaseProps {
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
    /**
     * SSR-прелоад высоты: true — использовать оценку (dense/title),
     * число — задать конкретное значение, иначе — не устанавливать.
     */
    preloadHeight?: boolean | number;
    render?: never;
}

export type TopAlertProps =
    | TopAlertBaseProps
    | {
          render: (params: {handleClose: () => void}) => React.ReactElement;
      };
