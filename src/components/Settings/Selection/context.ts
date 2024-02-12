import React from 'react';

import {SelectedSettingsPart, SettingsPage, getSelectedSettingsPart} from '../collect-settings';

import {SettingsSelection} from './types';

interface ContextValue extends SelectedSettingsPart {
    selectedRef?: React.RefObject<HTMLDivElement>;
}

const defaultValue: ContextValue = {};

const context = React.createContext(defaultValue);
context.displayName = 'SettingsSelectionContext';

export function useSettingsSelectionProviderValue(
    pages: Record<string, SettingsPage>,
    selection: SettingsSelection | undefined,
): ContextValue {
    const selectedRef = React.useRef<HTMLDivElement>(null);

    const contextValue: ContextValue = React.useMemo(() => {
        if (!selection) return {selectedRef};

        return {selectedRef, ...getSelectedSettingsPart(pages, selection)};
    }, [pages, selection]);

    return contextValue;
}

export const SettingsSelectionContextProvider = context.Provider;

export function useSettingsSelectionContext(): ContextValue {
    return React.useContext(context);
}
