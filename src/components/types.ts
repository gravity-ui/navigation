import React, {HTMLAttributeAnchorTarget} from 'react';

import {AlertProps, IconProps, QAProps} from '@gravity-ui/uikit';

export type MenuItemType = 'regular' | 'action' | 'divider';

export type AsideHeaderMenuItemAriaProps = React.AriaAttributes &
    Pick<React.HTMLAttributes<HTMLButtonElement>, 'role'>;

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
    pinned?: boolean;
    /**
     * When true, the item is shown in the quick access section between subheader and main menu.
     * Requires `enableQuickAccess` on AsideHeader and `onMenuItemsChanged` to toggle from the UI.
     */
    quickAccess?: boolean;
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
    /**
     * Maximum number of lines for the item title in the expanded sidebar.
     * Defaults to a single line with ellipsis; use `2` for a taller two-line row.
     */
    titleLines?: 1 | 2;
    className?: string;
    menuItemAriaProps?: AsideHeaderMenuItemAriaProps;
}

export interface MenuGroup {
    id: string;
    title: string;
    icon?: IconProps['data'];
    /** Hide the group from display */
    hidden?: boolean;
    /**
     * Optional title shown only in the compact popup that lists group children.
     * Does not affect the group title displayed anywhere else.
     */
    popupTitle?: string;
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
