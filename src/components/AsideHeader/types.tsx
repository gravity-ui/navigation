import {RenderContentType} from '../Content';
import {DrawerItemProps} from '../Drawer/Drawer';
import {
    LogoProps,
    MenuItem,
    SubheaderMenuItem,
    OpenModalSubscriber,
    AsideHeaderTopAlertProps,
} from '../types';
import {AsideHeaderContextType} from './AsideHeaderContext';

export interface LayoutProps {
    compact: boolean;
    className?: string;
}

export interface AsideHeaderGeneralProps {
    logo: LogoProps;
    multipleTooltip?: boolean;
    reverse?: boolean;
    className?: string;
    collapseTitle?: string;
    expandTitle?: string;
    menuMoreTitle?: string;
    topAlert?: AsideHeaderTopAlertProps;
    renderContent?: RenderContentType;
    renderFooter?: (data: {
        size: number;
        compact: boolean;
        asideRef: React.RefObject<HTMLDivElement>;
    }) => React.ReactNode;
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
