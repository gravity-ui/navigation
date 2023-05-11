import {MenuItem} from '../types';

export type MobileItemIconView = 'normal' | 'with-dot';

export interface ModalItem {
    visible: boolean;
    title?: string;
    id?: string;
    className?: string;
    contentClassName?: string;
    modalAllowHideOnContentScroll?: boolean;
    renderContent?: () => void;
    onClose?: () => void;
}

export type MobileMenuItemType = 'regular' | 'divider';

export interface MobileMenuItem
    extends Omit<
        MenuItem,
        | 'tooltipText'
        | 'pinned'
        | 'rightAdornment'
        | 'afterMoreButton'
        | 'itemWrapper'
        | 'onItemClick'
    > {
    type?: MobileMenuItemType;
    closeMenuOnClick?: boolean;
    onItemClick?: (item: MobileMenuItem) => void;
    itemWrapper?: (node: React.ReactNode, item: MobileMenuItem) => React.ReactNode;
}
