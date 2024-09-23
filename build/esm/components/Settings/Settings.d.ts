import React from 'react';
import { IconProps } from '@gravity-ui/uikit';
import { SettingsSelection } from './Selection';
import type { SettingsPageSection } from './collect-settings';
import './Settings.scss';
export interface SettingsProps {
    children: React.ReactNode;
    title?: string;
    filterPlaceholder?: string;
    emptyPlaceholder?: string;
    initialPage?: string;
    initialSearch?: string;
    selection?: SettingsSelection;
    onPageChange?: (page: string | undefined) => void;
    renderNotFound?: () => React.ReactNode;
    renderLoading?: () => React.ReactNode;
    loading?: boolean;
    view?: 'normal' | 'mobile';
    onClose?: () => void;
    renderRightAdornment?: (item: SettingsItemProps) => React.ReactNode;
    renderSectionRightAdornment?: (section: SettingsPageSection) => React.ReactNode;
    showRightAdornmentOnHover?: boolean;
}
export interface SettingsGroupProps {
    id?: string;
    groupTitle: string;
    children: React.ReactNode;
}
export interface SettingsPageProps {
    id?: string;
    title: string;
    icon?: IconProps;
    children: React.ReactNode;
}
export interface SettingsSectionProps {
    id?: string;
    title: string;
    header?: React.ReactNode;
    children: React.ReactNode;
    withBadge?: boolean;
    showTitle?: boolean;
    onlyChild?: boolean;
}
export interface SettingsItemProps {
    id?: string;
    labelId?: string;
    title: string;
    highlightedTitle?: React.ReactNode | null;
    renderTitleComponent?: (highlightedTitle: React.ReactNode | null) => React.ReactNode;
    align?: 'top' | 'center';
    children: React.ReactNode;
    withBadge?: boolean;
    mode?: 'row';
    description?: React.ReactNode;
}
export interface SettingsContextType extends Pick<SettingsProps, 'renderRightAdornment' | 'renderSectionRightAdornment' | 'showRightAdornmentOnHover'> {
}
export declare const useSettingsContext: () => SettingsContextType;
export declare function Settings({ loading, renderLoading, children, view, renderRightAdornment, renderSectionRightAdornment, showRightAdornmentOnHover, ...props }: SettingsProps): React.JSX.Element;
export declare namespace Settings {
    var Group: ({ children }: SettingsGroupProps) => React.JSX.Element;
    var Page: ({ children }: SettingsPageProps) => React.JSX.Element;
    var Section: ({ children }: SettingsSectionProps) => React.JSX.Element;
    var Item: (setting: SettingsItemProps) => React.JSX.Element;
}
