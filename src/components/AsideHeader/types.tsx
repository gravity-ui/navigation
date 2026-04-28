import * as React from 'react';

import {DrawerProps, PopupProps, QAProps} from '@gravity-ui/uikit';

import {RenderContentType} from '../Content';
import {LogoProps, MenuGroup, MenuItem, OpenModalSubscriber, TopAlertProps} from '../types';

import {AsideHeaderContextType} from './AsideHeaderContext';

export interface PanelItemProps extends DrawerProps {
    id: string;
}

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
    /**
     * Fired when visibility of a menu group is toggled from the All pages panel (pin on group header).
     * Use with `onMenuGroupsChanged` / controlled `menuGroups`.
     */
    onToggleMenuGroup?: (changedGroup: MenuGroup) => void;
}

/**
 * Menu overflow behavior.
 * - `collapse` — extra items collapse under a "More" popup (default).
 * - `scroll` — all items remain visible inside a scrollable container with a native thin scrollbar.
 *
 * In compact mode the menu always falls back to `collapse` regardless of this value
 * because a scrollbar over icon-only items is awkward.
 */
export type AsideHeaderMenuOverflow = 'collapse' | 'scroll';

interface AsideHeaderGeneralProps extends QAProps {
    logo?: LogoProps;
    className?: string;
    collapseTitle?: string;
    expandTitle?: string;
    menuMoreTitle?: string;
    /**
     * @see AsideHeaderMenuOverflow
     * @default 'collapse'
     */
    menuOverflow?: AsideHeaderMenuOverflow;
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
    panelItems?: PanelItemProps[];
    subheaderItems?: AsideHeaderItem[];
    menuItems?: AsideHeaderItem[];
    menuGroups?: MenuGroup[];
    /**
     * Controlled update for `menuGroups` (e.g. toggling `MenuGroup.hidden` from All pages).
     */
    onMenuGroupsChanged?: (menuGroups: MenuGroup[]) => void;
    defaultMenuItems?: AsideHeaderItem[];
    onMenuItemsChanged?: (items: AsideHeaderItem[]) => void;
    headerDecoration?: boolean;
    /**
     * When provided, the map is the source of truth for which menu groups are collapsed
     * in inline (`menuOverflow: 'scroll'`) layout. Keys are `MenuGroup.id`, values mean collapsed.
     */
    collapsedMenuGroupIds?: Record<string, boolean>;
    /**
     * Initial collapsed state for groups when `collapsedMenuGroupIds` is not controlled.
     */
    defaultCollapsedMenuGroupIds?: Record<string, boolean>;
    /**
     * Called when the user toggles a group in inline layout. The parent should update
     * `collapsedMenuGroupIds` when using controlled mode.
     */
    onToggleMenuGroupCollapsed?: (groupId: string) => void;
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

/** Menu item id for the All pages row (same value as {@link InnerPanels.AllPages}). */
export const ALL_PAGES_ID = InnerPanels.AllPages;

export interface AsideHeaderItem extends MenuItem {
    /**
     * @internal CompositeBar: group children rendered from the "More" overflow popover.
     */
    compositeBarMenuPopupItems?: AsideHeaderItem[];
    /**
     * @internal CompositeBar: optional heading in the overflow popover for a group row.
     */
    compositeBarMenuPopupTitle?: string;
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
