import React from 'react';
import './Burger.scss';
interface BurgerProps {
    closeTitle: string;
    openTitle: string;
    opened?: boolean;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
export declare const Burger: React.MemoExoticComponent<({ closeTitle, openTitle, opened, className, onClick }: BurgerProps) => React.JSX.Element>;
export {};
