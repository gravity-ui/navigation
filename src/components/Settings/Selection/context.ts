import React from 'react';

import {SelectedSettingsPart, SettingsPage, getSelectedSettingsPart} from '../collect-settings';

import {SettingsSelection} from './types';

export interface SettingsSelectionProviderContextValue extends SelectedSettingsPart {
    selectedRef?: React.RefObject<HTMLDivElement>;
}

const defaultValue: SettingsSelectionProviderContextValue = {};

const context = React.createContext(defaultValue);
context.displayName = 'SettingsSelectionContext';

export function useSettingsSelectionProviderValue(
    pages: Record<string, SettingsPage>,
    selection: SettingsSelection | undefined,
): SettingsSelectionProviderContextValue {
    const selectedRef = React.useRef<HTMLDivElement>(null);

    const contextValue: SettingsSelectionProviderContextValue = React.useMemo(() => {
        if (!selection) return {selectedRef};

        return {selectedRef, ...getSelectedSettingsPart(pages, selection)};
    }, [pages, selection]);

    return contextValue;
}

export const SettingsSelectionContextProvider = context.Provider;

export function useSettingsSelectionContext(): SettingsSelectionProviderContextValue {
    return React.useContext(context);
}
