import {QAProps} from '@gravity-ui/uikit';

import {RenderContentType} from '../Content';
import {DrawerItemProps} from '../Drawer/Drawer';
import {
    AsideHeaderTopAlertProps,
    LogoProps,
    MenuItem,
    OpenModalSubscriber,
    SubheaderMenuItem,
} from '../types';

import {AsideHeaderContextType} from './AsideHeaderContext';

export interface LayoutProps {
    compact: boolean;
    className?: string;
    topAlert?: AsideHeaderTopAlertProps;
}

export interface EditMenuProps {
    onOpenEditMode?: () => void;
    onToggleMenuItem?: (changedItem: MenuItem) => void;
    onResetSettingsToDefault?: () => void;
}

export interface AsideHeaderGeneralProps extends QAProps {
    logo?: LogoProps;
    multipleTooltip?: boolean;
    className?: string;
    collapseTitle?: string;
    expandTitle?: string;
    menuMoreTitle?: string;
    topAlert?: AsideHeaderTopAlertProps;
    customBackground?: React.ReactNode;
    customBackgroundClassName?: string;
    hideCollapseButton?: boolean;
    renderContent?: RenderContentType;
    renderFooter?: (data: {
        size: number;
        compact: boolean;
        asideRef: React.RefObject<HTMLDivElement>;
    }) => React.ReactNode;
    editMenuProps: EditMenuProps;
    onClosePanel?: () => void;
    onChangeCompact?: (compact: boolean) => void;
    openModalSubscriber?: (subscriber: OpenModalSubscriber) => void;
}

export interface AsideHeaderDefaultProps {
    panelItems?: DrawerItemProps[];
    subheaderItems?: SubheaderMenuItem[];
    menuItems?: MenuItem[];
    onMenuItemsChanged?: (items: MenuItem[]) => void;
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
