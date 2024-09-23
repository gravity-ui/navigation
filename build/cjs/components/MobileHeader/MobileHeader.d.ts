import React from 'react';
import { RenderContentType } from '../Content';
import { DrawerItemProps } from '../Drawer/Drawer';
import { LogoProps } from '../types';
import { BurgerMenuInnerProps } from './BurgerMenu/BurgerMenu';
import { MobileHeaderEvent } from './types';
import './MobileHeader.scss';
interface BurgerMenuProps extends Omit<BurgerMenuInnerProps, 'renderFooter'> {
    renderFooter?: (data: {
        size: number;
        isCompact: boolean;
    }) => React.ReactNode;
}
interface PanelItem extends Omit<DrawerItemProps, 'visible'> {
}
export interface MobileHeaderProps {
    logo: LogoProps;
    burgerMenu: BurgerMenuProps;
    burgerCloseTitle?: string;
    burgerOpenTitle?: string;
    panelItems?: PanelItem[];
    renderContent?: RenderContentType;
    sideItemRenderContent?: RenderContentType;
    onEvent?: (itemName: string, eventName: MobileHeaderEvent) => void;
    onClosePanel?: () => void;
    className?: string;
    contentClassName?: string;
}
export declare const MobileHeader: React.ForwardRefExoticComponent<MobileHeaderProps & React.RefAttributes<HTMLDivElement>>;
export {};
