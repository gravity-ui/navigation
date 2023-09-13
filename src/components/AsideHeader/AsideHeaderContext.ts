import React from 'react';
import {MenuItem} from '../types';
import {AsideHeaderInnerProps} from './asideHeaderTypes';

export interface AsideHeaderContextType extends AsideHeaderInnerProps {
    size: number;
    onItemClick: (
        item: MenuItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => void;
}

export const AsideHeaderContext = React.createContext<AsideHeaderContextType | undefined>(
    undefined,
);

export const AsideHeaderContextProvider = AsideHeaderContext.Provider;

export const useAsideHeaderContext = (): AsideHeaderContextType => {
    const contextValue = React.useContext(AsideHeaderContext);
    if (contextValue === undefined) {
        throw new Error(`AsideHeaderContext is not initialized.
        Please check if you wrapped your component with AsideHeaderContext.Provider`);
    }
    return contextValue;
};
