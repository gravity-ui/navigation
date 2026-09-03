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
     * When set, the row is an inline (expanded sidebar) group header: chevron up/down
     * instead of a flyout chevron, and children render in a nested list.
     */
    groupHeaderExpanded?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    /** When true, the icon slot is not rendered (e.g. compact popover: icon stays in the bar). */
    hideIcon?: boolean;
    /**
     * Stops click bubbling so portaled popup rows do not trigger the parent Item's onClick.
     * Off when `itemWrapper` is set so the wrapper (e.g. react-router Link) receives the click.
     */
    stopClickPropagation?: boolean;
    /** Direct AsideHeader `onItemClick` for rows rendered inside {@link ItemPopup}. */
    onPopupItemClick?: AsideHeaderItem['onItemClick'];
    /**
     * Inline group header only: renders the chevron as a separate interactive control
     * that fires this callback (expand/collapse) instead of the row click, so the row
     * itself can carry the group's own main action.
     */
    onGroupHeaderChevronClick?: (event: React.SyntheticEvent) => void;
    /** When `true`, the chevron is not rendered in the compact (collapsed) sidebar. */
    hideCompactChevron?: boolean;
    /** Inline menu-group tree (L-connector) rendered inside the row, before the icon slot. */
    menuGroupNestedTreeConnector?: React.ReactNode;
}
