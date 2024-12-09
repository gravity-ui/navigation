import {QAProps} from '@gravity-ui/uikit';

import {RenderContentType} from '../Content';
import {DrawerItemProps} from '../Drawer/Drawer';
import {LogoProps, MenuItem, OpenModalSubscriber, SubheaderMenuItem, TopAlertProps} from '../types';

import {AsideHeaderContextType} from './AsideHeaderContext';

export interface LayoutProps {
    compact: boolean;
    className?: string;
    topAlert?: TopAlertProps;
}

export interface EditMenuProps {
    onOpenEditMode?: () => void;
    onToggleMenuItem?: (changedItem: MenuItem) => void;
    onResetSettingsToDefault?: () => void;
    enableSorting?: boolean;
    onChangeItemsOrder?: (changedItem: MenuItem, oldIndex: number, newIndex: number) => void;
}

export interface AsideHeaderGeneralProps extends QAProps {
    logo?: LogoProps;
    multipleTooltip?: boolean;
    className?: string;
    collapseTitle?: string;
    expandTitle?: string;
    menuMoreTitle?: string;
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
    editMenuProps?: EditMenuProps;
    onClosePanel?: () => void;
    onChangeCompact?: (compact: boolean) => void;
    onMenuMoreClick?: () => void;
    onAllPagesClick?: () => void;
    openModalSubscriber?: (subscriber: OpenModalSubscriber) => void;
}

export interface AsideHeaderDefaultProps {
    panelItems?: DrawerItemProps[];
    subheaderItems?: SubheaderMenuItem[];
    menuItems?: MenuItem[];
    defaultMenuItems?: MenuItem[];
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
