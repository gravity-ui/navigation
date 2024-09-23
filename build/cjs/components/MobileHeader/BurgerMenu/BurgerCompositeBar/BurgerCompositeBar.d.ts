import React from 'react';
import { MobileMenuItem } from '../../types';
import './BurgerCompositeBar.scss';
interface BurgerCompositeBarProps {
    items: MobileMenuItem[];
    onItemClick?: (item: MobileMenuItem) => void;
}
export declare const BurgerCompositeBar: React.MemoExoticComponent<({ items, onItemClick }: BurgerCompositeBarProps) => React.JSX.Element>;
export {};
