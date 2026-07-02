import * as React from 'react';

import type {AsideHeaderItem} from 'src/components/AsideHeader/types';

export interface ItemProps extends AsideHeaderItem {}

export interface ItemInnerProps extends ItemProps {
    className?: string;
    popupItemClassName?: string;
    /** Items shown in the compact (or expanded overflow) popover: group children or overflow list. */
    menuPopupItems?: AsideHeaderItem[];
    /** Optional title rendered at the top of the popup listing `menuPopupItems`. */
    menuPopupTitle?: string;
    /**
     * When set, the row is an inline (expanded sidebar) group header: chevron right
     * when collapsed, chevron down when expanded. Collapsed headers may still show a
     * hover flyout; expanded headers render children in a nested list instead.
     */
    groupHeaderExpanded?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    /** When true, the icon slot is not rendered (e.g. compact popover: icon stays in the bar). */
    hideIcon?: boolean;
    /**
     * When set, controls icon visibility for rows rendered inside {@link ItemPopup}
     * (group children). Defaults to `true` (hidden) when unset.
     */
    menuPopupHideIcon?: boolean;
    /** Row rendered inside {@link ItemPopup}; uses single-line title layout regardless of `titleLines`. */
    menuPopupRow?: boolean;
    /**
     * Stops click bubbling so portaled popup rows do not trigger the parent Item's onClick.
     * Off when `itemWrapper` is set so the wrapper (e.g. react-router Link) receives the click.
     */
    stopClickPropagation?: boolean;
    /** Direct AsideHeader `onItemClick` for rows rendered inside {@link ItemPopup}. */
    onPopupItemClick?: AsideHeaderItem['onItemClick'];
    /** Inline menu-group tree (L-connector) rendered inside the row, before the icon slot. */
    menuGroupNestedTreeConnector?: React.ReactNode;
    /** Inline expanded menu-group child row (icon + title after parent tree connectors). */
    menuGroupNested?: boolean;
    enableQuickAccessPin?: boolean;
    onToggleQuickAccess?: (item: AsideHeaderItem) => void;
}
