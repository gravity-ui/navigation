import React from 'react';

import {AsideHeaderInnerProps, AsideHeaderItem} from './types';

export interface AsideHeaderInnerContextType extends AsideHeaderInnerProps {
    menuItems: AsideHeaderItem[];
    defaultMenuItems?: AsideHeaderItem[];
    allPagesIsAvailable: boolean;
    onItemClick: (
        item: AsideHeaderItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    handleMouseEnter?: () => void;
    handleMouseLeave?: () => void;
    isExpanded: boolean;
}

const AsideHeaderInnerContext = React.createContext<AsideHeaderInnerContextType | undefined>(
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
    isExpanded: boolean;
    onChangeCompact?: (compact: boolean) => void;
    handleMouseEnter?: () => void;
    handleMouseLeave?: () => void;
}

const AsideHeaderContext = React.createContext<AsideHeaderContextType | undefined>({
    compact: false,
    size: 0,
    isExpanded: false,
    onChangeCompact: () => {},
    handleMouseEnter: () => {},
    handleMouseLeave: () => {},
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
