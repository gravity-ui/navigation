import React from 'react';

import {AsideHeaderMenuDensity} from './density';
import {AsideHeaderInnerProps, AsideHeaderItem} from './types';

export interface AsideHeaderInnerContextType extends AsideHeaderInnerProps {
    menuItems: AsideHeaderItem[];
    defaultMenuItems?: AsideHeaderItem[];
    allPagesIsAvailable: boolean;
    quickAccessIsAvailable: boolean;
    onItemClick: (
        item: AsideHeaderItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    onToggleQuickAccess: (item: AsideHeaderItem) => void;
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
    /**
     * The compact state to render. While the collapse/expand width transition
     * runs it lags behind `compact` (holding the state the transition started
     * from), so the inner content does not re-fit on every animation frame.
     * Defaults to `compact` when omitted.
     */
    presentationCompact?: boolean;
    size: number;
    menuDensity?: AsideHeaderMenuDensity;
}

const AsideHeaderContext = React.createContext<AsideHeaderContextType | undefined>({
    compact: false,
    size: 0,
    menuDensity: 'default',
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

export const useSafeAsideHeaderContext = (): AsideHeaderContextType | undefined => {
    const contextValue = React.useContext(AsideHeaderContext);

    return contextValue;
};
