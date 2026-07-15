import * as React from 'react';

import {DrawerProps, PopupProps, QAProps} from '@gravity-ui/uikit';

import {RenderContentType} from '../Content';
import {LogoProps, MenuGroup, MenuItem, OpenModalSubscriber, TopAlertProps} from '../types';

import {AsideHeaderContextType} from './AsideHeaderContext';
import {AsideHeaderMenuDensity} from './density';

export interface PanelItemProps extends DrawerProps {
    id: string;
}

export interface LayoutProps {
    compact: boolean;
    className?: string;
    topAlert?: TopAlertProps;
    /**
     * Menu item density. `compact` reduces item height, icon size, and spacing
     * while keeping row dimensions identical in collapsed and expanded aside states.
     * @default 'default'
     */
    menuDensity?: AsideHeaderMenuDensity;
}

interface EditMenuProps {
    onOpenEditMode?: () => void;
    onToggleMenuItem?: (changedItem: AsideHeaderItem) => void;
    onToggleQuickAccess?: (changedItem: AsideHeaderItem) => void;
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
     * Called only from **All pages** edit mode when the user toggles visibility of a **menu group** (group header pin), updating `menuGroup.hidden`.
     * Use with controlled `menuGroups`; not emitted for programmatic `menuGroups` changes outside All pages.
     */
    onMenuGroupsChanged?: (menuGroups: MenuGroup[]) => void;
    defaultMenuItems?: AsideHeaderItem[];
    onMenuItemsChanged?: (items: AsideHeaderItem[]) => void;
    /**
     * Shows the **All pages** menu row and panel. Enabled by default when `onMenuItemsChanged` is set.
     * Set to `false` to use `onMenuItemsChanged` for other features (e.g. quick access) without All pages.
     * @default true
     */
    enableAllPages?: boolean;
    /**
     * Enables the quick access section and inline pin controls on menu leaf items.
     * Toggling requires controlled `menuItems` with `onMenuItemsChanged` (persist via localStorage/backend in the app).
     */
    enableQuickAccess?: boolean;
    /**
     * When `false`, hides the pinned quick access section and disables pin controls on menu items.
     * Has no effect when `enableQuickAccess` is `false`.
     * @default true
     */
    showQuickAccessSection?: boolean;
    /**
     * When `true`, the active (`current`) menu item stays highlighted in the main menu
     * even when it is also shown in the quick access section.
     * @default false
     */
    quickAccessHighlightInMainMenu?: boolean;
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
    /**
     * When `false`, nested menu group items render without icons (inline scroll layout
     * and group popups in compact / collapsed-group mode).
     * @default true
     */
    menuGroupNestedIcons?: boolean;
    /**
     * When `true` and `menuOverflow="scroll"` (non-compact), quick access and main menu
     * share one scroll container instead of separate scroll areas.
     * @default false
     */
    unifiedMenuScroll?: boolean;
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
