/// <reference types="react" />
import { MenuItem } from '../types';
export interface ModalItem {
    visible: boolean;
    title?: string;
    id?: string;
    className?: string;
    contentClassName?: string;
    modalAllowHideOnContentScroll?: boolean;
    renderContent?: () => React.ReactNode;
    onClose?: () => void;
}
export type MobileMenuItemType = 'regular' | 'divider';
export interface MobileMenuItem extends Omit<MenuItem, 'tooltipText' | 'pinned' | 'rightAdornment' | 'afterMoreButton' | 'itemWrapper' | 'onItemClick'> {
    type?: MobileMenuItemType;
    closeMenuOnClick?: boolean;
    onItemClick?: (item: MobileMenuItem) => void;
    itemWrapper?: (node: React.ReactNode, item: MobileMenuItem) => React.ReactNode;
}
export type MobileHeaderEvent = 'MOBILE_PANEL_TOGGLE' | 'MOBILE_PANEL_CLOSE' | 'MOBILE_PANEL_OPEN';
export type ItemEventsConfig = {
    closeEvent: MobileHeaderEvent;
    openEvent: MobileHeaderEvent;
    toggleEvent?: MobileHeaderEvent;
};
export type MobileHeaderEventOptions = {
    panelName?: string;
};
