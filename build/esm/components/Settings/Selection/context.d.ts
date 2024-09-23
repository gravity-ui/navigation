import React from 'react';
import { SelectedSettingsPart, SettingsPage } from '../collect-settings';
import { SettingsSelection } from './types';
interface ContextValue extends SelectedSettingsPart {
    selectedRef?: React.RefObject<HTMLDivElement>;
}
export declare function useSettingsSelectionProviderValue(pages: Record<string, SettingsPage>, selection: SettingsSelection | undefined): ContextValue;
export declare const SettingsSelectionContextProvider: React.Provider<ContextValue>;
export declare function useSettingsSelectionContext(): ContextValue;
export {};
