import React from 'react';

import {MenuItem} from '../types';

import {AsideHeaderInnerProps} from './types';

export interface AsideHeaderInnerContextType extends AsideHeaderInnerProps {
    menuItems: MenuItem[];
    defaultMenuItems?: MenuItem[];
    allPagesIsAvailable: boolean;
    onItemClick: (
        item: MenuItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
}

export const AsideHeaderInnerContext = React.createContext<AsideHeaderInnerContextType | undefined>(
    undefined,
);
AsideHeaderInnerContext.displayName = 'AsideHeaderInnerContext';

export const AsideHeaderInnerContextProvider = AsideHeaderInnerContext.Provider;

export const useAsideHeaderInnerContext = (): AsideHeaderInnerContextType => {
    const contextValue = React.useContext(AsideHeaderInnerContext);
    if (contextValue === undefined) {
        throw new Error(`AsideHeaderInnerContext is not initialized.
        Please check if you wrapped your component with AsideHeaderInnerContext.Provider`);
    }
    return contextValue;
};

export interface AsideHeaderContextType {
    compact: boolean;
    size: number;
}

export const AsideHeaderContext = React.createContext<AsideHeaderContextType | undefined>({
    compact: false,
    size: 0,
});

AsideHeaderContext.displayName = 'AsideHeaderContext';

export const AsideHeaderContextProvider = AsideHeaderContext.Provider;

export const useAsideHeaderContext = (): AsideHeaderContextType => {
    const contextValue = React.useContext(AsideHeaderContext);
    if (contextValue === undefined) {
        throw new Error(`AsideHeaderContext is not initialized.
        Please check if you wrapped your component with AsideHeader
        Context.Provider`);
    }
    return contextValue;
};
