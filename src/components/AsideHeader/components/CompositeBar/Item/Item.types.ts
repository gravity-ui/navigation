import * as React from 'react';

import {AsideHeaderItem} from 'src/components/AsideHeader/types';

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
     * Stops click bubbling so portaled content (e.g. compact popover duplicate) does not trigger
     * the parent Item's onClick in the React tree.
     */
    stopClickPropagation?: boolean;
    /** Inline menu-group tree (L-connector) rendered inside the row, before the icon slot. */
    menuGroupNestedTreeConnector?: React.ReactNode;
}
