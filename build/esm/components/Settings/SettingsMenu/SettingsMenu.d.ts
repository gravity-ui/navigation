import React from 'react';
import { SettingsMenuProps } from '../types';
import './SettingsMenu.scss';
export interface SettingsMenuInstance {
    handleKeyDown(event: React.KeyboardEvent): boolean;
    clearFocus(): void;
}
export declare const SettingsMenu: React.ForwardRefExoticComponent<SettingsMenuProps & React.RefAttributes<SettingsMenuInstance>>;
