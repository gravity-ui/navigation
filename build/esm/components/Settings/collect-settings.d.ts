import React from 'react';
import { IconProps } from '@gravity-ui/uikit';
import { SettingsSelection } from './Selection/types';
export type SettingsMenu = (SettingsMenuGroup | SettingsMenuItem)[];
interface SettingsMenuGroup {
    groupTitle: string;
    items: SettingsMenuItem[];
}
interface SettingsMenuItem {
    id: string;
    title: string;
    icon?: IconProps;
    withBadge?: boolean;
    disabled?: boolean;
}
export interface SettingsPage {
    id: string;
    sections: SettingsPageSection[];
    hidden?: boolean;
    withBadge?: boolean;
}
export interface SettingsPageSection {
    id?: string;
    title: string;
    header?: React.ReactNode;
    items: SettingsItem[];
    hidden?: boolean;
    withBadge?: boolean;
    showTitle?: boolean;
    onlyChild?: boolean;
}
export interface SettingsItem {
    id?: string;
    title: string;
    element: React.ReactElement;
    hidden: boolean;
    titleComponent?: React.ReactNode;
    renderTitleComponent?: (highlightedTitle: React.ReactNode | null) => React.ReactNode;
}
export interface SelectedSettingsPart {
    page?: SettingsPage;
    section?: SettingsPageSection;
    setting?: SettingsItem;
}
interface SettingsDescription {
    menu: SettingsMenu;
    pages: Record<string, SettingsPage>;
}
export declare function getSettingsFromChildren(children: React.ReactNode, searchText?: string): SettingsDescription;
export declare function getSelectedSettingsPart(pages: Record<string, SettingsPage>, selection: SettingsSelection): SelectedSettingsPart;
export {};
