import React from 'react';
import { MobileMenuItem, ModalItem } from '../types';
import './BurgerMenu.scss';
export interface BurgerMenuInnerProps {
    items?: MobileMenuItem[];
    modalItem?: ModalItem;
    renderFooter?: () => React.ReactNode;
    onItemClick?: (item: MobileMenuItem) => void;
    className?: string;
}
export declare const BurgerMenu: React.MemoExoticComponent<({ items, renderFooter, modalItem, className, onItemClick }: BurgerMenuInnerProps) => React.JSX.Element>;
