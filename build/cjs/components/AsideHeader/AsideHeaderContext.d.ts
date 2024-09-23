import React from 'react';
import { MenuItem } from '../types';
import { AsideHeaderInnerProps } from './types';
export interface AsideHeaderInnerContextType extends AsideHeaderInnerProps {
    menuItems: MenuItem[];
    allPagesIsAvailable: boolean;
    onItemClick: (item: MenuItem, collapsed: boolean, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
export declare const AsideHeaderInnerContext: React.Context<AsideHeaderInnerContextType | undefined>;
export declare const AsideHeaderInnerContextProvider: React.Provider<AsideHeaderInnerContextType | undefined>;
export declare const useAsideHeaderInnerContext: () => AsideHeaderInnerContextType;
export interface AsideHeaderContextType {
    compact: boolean;
    size: number;
}
export declare const AsideHeaderContext: React.Context<AsideHeaderContextType | undefined>;
export declare const AsideHeaderContextProvider: React.Provider<AsideHeaderContextType | undefined>;
export declare const useAsideHeaderContext: () => AsideHeaderContextType;
