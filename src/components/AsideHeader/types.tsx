import * as React from 'react';

import {PopupProps, QAProps} from '@gravity-ui/uikit';

import {RenderContentType} from '../Content';
import {DrawerItemProps} from '../Drawer/Drawer';
import {LogoProps, MenuItem, OpenModalSubscriber, TopAlertProps} from '../types';

import {AsideHeaderContextType} from './AsideHeaderContext';

export interface LayoutProps {
    compact: boolean;
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
    multipleTooltip?: boolean;
    className?: string;
    collapseTitle?: string;
    expandTitle?: string;
    menuMoreTitle?: string;
    topAlert?: TopAlertProps;
    customBackground?: React.ReactNode;
    customBackgroundClassName?: string;
    hideCollapseButton?: boolean;
    renderContent?: RenderContentType;
    renderFooter?: (data: {
        size: number;
        compact: boolean;
        asideRef: React.RefObject<HTMLDivElement>;
    }) => React.ReactNode;
    collapseButtonWrapper?: (
        defaultButton: React.ReactNode,
        data: {
            compact: boolean;
            onChangeCompact?: (compact: boolean) => void;
        },
    ) => React.ReactNode;
    editMenuProps?: EditMenuProps;
    onClosePanel?: () => void;
    onChangeCompact?: (compact: boolean) => void;
    onMenuMoreClick?: () => void;
    onAllPagesClick?: () => void;
    openModalSubscriber?: (subscriber: OpenModalSubscriber) => void;
}

interface AsideHeaderDefaultProps {
    panelItems?: DrawerItemProps[];
    subheaderItems?: AsideHeaderItem[];
    menuItems?: AsideHeaderItem[];
    defaultMenuItems?: AsideHeaderItem[];
    onMenuItemsChanged?: (items: AsideHeaderItem[]) => void;
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
    ) => void;
    bringForward?: boolean;
    compact?: boolean;

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
