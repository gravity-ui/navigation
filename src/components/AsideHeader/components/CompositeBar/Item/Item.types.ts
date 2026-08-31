import * as React from 'react';

import type {AsideHeaderItem} from 'src/components/AsideHeader/types';

export type QuickAccessToggleHandler = (
    item: AsideHeaderItem,
    event?: React.MouseEvent<HTMLButtonElement>,
) => void;

export interface ItemProps extends AsideHeaderItem {}

export interface ItemInnerProps extends ItemProps {
    className?: string;
    popupItemClassName?: string;
    /** Items shown in the compact (or expanded overflow) popover: group children or overflow list. */
    menuPopupItems?: AsideHeaderItem[];
    /** Optional title rendered at the top of the popup listing `menuPopupItems`. */
    menuPopupTitle?: string;
    /**
     * When set, the row is an inline (expanded sidebar) group header: chevron right/down
     * instead of a flyout chevron. A collapsed header may still open its children in a popup.
     */
    groupHeaderExpanded?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    /** When true, the icon slot is not rendered (e.g. compact popover: icon stays in the bar). */
    hideIcon?: boolean;
    /** Controls icon visibility for the rows rendered in this item's popup. */
    menuPopupHideIcon?: boolean;
    /** Controls icon visibility one popup level deeper (a group nested inside `More`). */
    menuPopupNestedHideIcon?: boolean;
    /** Row rendered inside ItemPopup; always uses a single-line title. */
    menuPopupRow?: boolean;
    /** Suppresses selected styling without changing the source item's `current` value. */
    suppressCurrentHighlight?: boolean;
    /** Item ids whose current state is visually suppressed in this item's popup. */
    suppressCurrentItemIds?: ReadonlySet<string>;
    /**
     * Stops click bubbling so portaled popup rows do not trigger the parent Item's onClick.
     * Off when `itemWrapper` is set so the wrapper (e.g. react-router Link) receives the click.
     */
    stopClickPropagation?: boolean;
    /** Direct AsideHeader `onItemClick` for rows rendered inside {@link ItemPopup}. */
    onPopupItemClick?: AsideHeaderItem['onItemClick'];
    /** Inline menu-group tree (L-connector) rendered inside the row, before the icon slot. */
    menuGroupNestedTreeConnector?: React.ReactNode;
    /** Inline expanded menu-group child row. */
    menuGroupNested?: boolean;
    /** Enables pin/unpin controls for eligible leaf items. */
    enableQuickAccessPin?: boolean;
    /** Original public item used by the quick access callback. */
    quickAccessPinItem?: AsideHeaderItem;
    onToggleQuickAccess?: QuickAccessToggleHandler;
}
