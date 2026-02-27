import * as React from 'react';

import {DrawerProps, PopupProps, QAProps} from '@gravity-ui/uikit';

import {RenderContentType} from '../Content';
import {LogoProps, MenuGroup, MenuItem, OpenModalSubscriber, TopAlertProps} from '../types';

import {AsideHeaderContextType} from './AsideHeaderContext';

export interface PanelItemProps extends DrawerProps {
    id: string;
}

export interface LayoutProps {
    /** Navigation visual state. When `true`, the navigation is expanded (pinned open). When `false`, it is collapsed. */
    pinned: boolean;
    className?: string;
    topAlert?: TopAlertProps;
}

interface EditMenuProps {
    onOpenEditMode?: () => void;
    onToggleMenuItem?: (changedItem: AsideHeaderItem) => void;
    onResetSettingsToDefault?: () => void;
    enableSorting?: boolean;
    onChangeItemsOrder?: (changedItem: AsideHeaderItem, oldIndex: number, newIndex: number) => void;
}

interface AsideHeaderGeneralProps extends QAProps {
    logo?: LogoProps;
    className?: string;
    collapseTitle?: string;
    expandTitle?: string;
    menuMoreTitle?: string;
    topAlert?: TopAlertProps;
    customBackground?: React.ReactNode;
    customBackgroundClassName?: string;
    hideCollapseButton?: boolean;
    /** When `true`, menu items use compact height. */
    isCompactMode?: boolean;
    renderContent?: RenderContentType;
    /**
     * Render function for the footer section.
     *
     * Return types:
     * - `React.ReactNode` - Renders custom content as-is
     * - `React.ReactNode[]` - Wraps in FooterBar with horizontal/vertical layout based on isPinned
     */
    renderFooter?: (data: {
        size: number;
        isExpanded: boolean;
        isPinned: boolean;
        asideRef: React.RefObject<HTMLDivElement>;
        isCompactMode?: boolean;
    }) => React.ReactNode | React.ReactNode[];
    /** Render function for additional content after items (e.g., user profile). Receives options with setCollapseBlocker to block sidebar collapse while a popup is open. */
    renderFooterAfter?: (options?: {setCollapseBlocker?: SetCollapseBlocker}) => React.ReactNode;
    collapseButtonWrapper?: (
        defaultButton: React.ReactNode,
        data: {
            isExpanded: boolean;
            onChangePinned?: (pinned: boolean) => void;
        },
    ) => React.ReactNode;
    editMenuProps?: EditMenuProps;
    onClosePanel?: () => void;
    onChangePinned?: (pinned: boolean) => void;
    onMenuMoreClick?: () => void;
    onAllPagesClick?: () => void;
    openModalSubscriber?: (subscriber: OpenModalSubscriber) => void;
}

interface AsideHeaderDefaultProps {
    panelItems?: PanelItemProps[];
    subheaderItems?: AsideHeaderItem[];
    menuItems?: AsideHeaderItem[];
    defaultMenuItems?: AsideHeaderItem[];
    menuGroups?: MenuGroup[];
    defaultMenuGroups?: MenuGroup[];
    onMenuItemsChanged?: (items: AsideHeaderItem[]) => void;
    onMenuGroupsChanged?: (groups: MenuGroup[]) => void;
    headerDecoration?: boolean;
}

export type AsideHeaderInnerProps = AsideHeaderGeneralProps &
    AsideHeaderDefaultProps &
    AsideHeaderContextType;

export interface AsideHeaderProps
    extends AsideHeaderGeneralProps,
        LayoutProps,
        Partial<AsideHeaderDefaultProps> {}

export enum InnerPanels {
    AllPages = 'all-pages',
}

export interface AsideHeaderItem extends MenuItem {
    enableTooltip?: boolean;
    onItemClick?: (
        item: AsideHeaderItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        options: {setCollapseBlocker: SetCollapseBlocker | undefined},
    ) => void;
    bringForward?: boolean;
    /** When `true`, forces the item to display in expanded form. */
    isExpanded?: boolean;

    /**
     * @deprecated Use itemWrapper instead for popup functionality
     */
    popupVisible?: PopupProps['open'];
    /**
     * Floating element anchor ref object
     *
     * @deprecated Use itemWrapper instead for popup functionality
     */
    popupRef?: React.RefObject<HTMLElement>;
    /**
     * @deprecated Use itemWrapper instead for popup functionality
     */
    popupPlacement?: PopupProps['placement'];
    /**
     * @deprecated Use itemWrapper instead for popup functionality
     */
    popupOffset?: PopupProps['offset'];
    /**
     * @deprecated Use itemWrapper instead for popup functionality
     */
    popupKeepMounted?: PopupProps['keepMounted'];
    /**
     * @deprecated Use itemWrapper instead for popup functionality
     */
    renderPopupContent?: () => React.ReactNode;
    /**
     * This callback will be called when Escape key pressed on keyboard, or click outside was made
     * This behaviour could be disabled with `disableEscapeKeyDown`
     * and `disableOutsideClick` options
     *
     * @deprecated Use itemWrapper instead for popup functionality
     */
    onOpenChangePopup?: PopupProps['onOpenChange'];
}

export interface GroupedMenuItem extends MenuItem {
    groupId: string;
    collapsible: boolean;
    isCollapsed: boolean;
    collapsedByDefault?: boolean;
    items: MenuItemsWithGroups[];
}

export type MenuItemsWithGroups = MenuItem | GroupedMenuItem;

/** Toggles a collapse blocker: pass `true` to block collapsing, `false` to unblock. */
export type SetCollapseBlocker = (isBlocked: boolean) => void;
