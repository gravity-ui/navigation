import {RenderContentType} from '../Content';
import {DrawerItemProps} from '../Drawer/Drawer';
import {LogoProps, MenuItem, SubheaderMenuItem, OpenModalSubscriber} from '../types';

export interface AsideHeaderGeneralProps {
    logo: LogoProps;
    compact: boolean;
    multipleTooltip?: boolean;
    className?: string;
    collapseTitle?: string;
    expandTitle?: string;
    menuMoreTitle?: string;
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
    headerDecoration?: boolean;
}

export type AsideHeaderInnerProps = AsideHeaderGeneralProps & AsideHeaderDefaultProps;
