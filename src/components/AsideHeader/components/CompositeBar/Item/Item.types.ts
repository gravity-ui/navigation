import {AsideHeaderItem} from 'src/components/AsideHeader/types';

export interface ItemProps extends AsideHeaderItem {}

export interface ItemInnerProps extends ItemProps {
    className?: string;
    /** Items shown in the compact (or expanded overflow) popover: group children or overflow list. */
    menuPopupItems?: AsideHeaderItem[];
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    /** When true, the icon slot is not rendered (e.g. compact popover: icon stays in the bar). */
    hideIcon?: boolean;
    /**
     * Stops click bubbling so portaled content (e.g. compact popover duplicate) does not trigger
     * the parent Item's onClick in the React tree.
     */
    stopClickPropagation?: boolean;
}
