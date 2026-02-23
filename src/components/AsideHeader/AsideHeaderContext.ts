import React from 'react';

import {MenuGroup} from '../types';

import {AsideHeaderInnerProps, AsideHeaderItem, SetCollapseBlocker} from './types';

export interface AsideHeaderInnerContextType extends AsideHeaderInnerProps {
    menuItems: AsideHeaderItem[];
    menuGroups?: MenuGroup[];
    defaultMenuItems?: AsideHeaderItem[];
    defaultMenuGroups?: MenuGroup[];
    onMenuGroupsChanged?: (groups: MenuGroup[]) => void;
    onToggleGroupCollapsed?: (groupId: string) => void;
    allPagesIsAvailable: boolean;
    onItemClick: (
        item: AsideHeaderItem,
        collapsed: boolean,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    onExpand?: () => void;
    onFold?: () => void;
    isExpanded: boolean;
    /** Registers a temporary block on collapse (e.g. while dropdown is open). Returns release function. */
    setCollapseBlocker?: SetCollapseBlocker;
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
    /** Navigation visual state. When `true`, the navigation is expanded (pinned open). When `false`, it is collapsed. */
    pinned: boolean;
    size: number;
    isExpanded: boolean;
    onChangePinned?: (pinned: boolean) => void;
    onExpand?: () => void;
    onFold?: () => void;
    /** Registers a temporary block on collapse (e.g. while dropdown is open). Returns release function. */
    setCollapseBlocker?: SetCollapseBlocker;
}

const AsideHeaderContext = React.createContext<AsideHeaderContextType | undefined>(undefined);

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

/** Returns context value or undefined when used outside AsideHeader. Use when component can be used with or without provider. */
export const useAsideHeaderContextOptional = (): AsideHeaderContextType | undefined => {
    return React.useContext(AsideHeaderContext);
};
