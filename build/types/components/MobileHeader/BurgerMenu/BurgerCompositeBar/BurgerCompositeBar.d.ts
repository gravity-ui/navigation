import { default as React } from 'react';
import { MobileMenuItem } from '../../types';
interface BurgerCompositeBarProps {
    items: MobileMenuItem[];
    onItemClick?: (item: MobileMenuItem) => void;
}
export declare const BurgerCompositeBar: React.MemoExoticComponent<({ items, onItemClick }: BurgerCompositeBarProps) => React.JSX.Element>;
export {};
