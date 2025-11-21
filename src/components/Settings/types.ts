import type React from 'react';

import type {IconProps} from '@gravity-ui/uikit';

import type {SettingsSelection} from './Selection';
import type {SettingsPageSection} from './collect-settings';

interface GroupItem {
    groupTitle: string;
    items: Item[];
}

export interface Item {
    id: string;
    title: string;
    icon?: IconProps;
    disabled?: boolean;
    withBadge?: boolean;
}

type SettingsMenuItems = (GroupItem | Item)[];

export interface SettingsMenuProps {
    items: SettingsMenuItems;
    onChange: (id: string) => void;
    activeItemId?: string;
    focusItemId?: string;
    className?: string;
}

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
    title?: string;
    icon?: IconProps;
    children: React.ReactNode;
}

export interface SettingsSectionProps {
    id?: string;
    title: string;
    header?: React.ReactNode;
    children: React.ReactNode;
    withBadge?: boolean;
    hideTitle?: boolean;
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
    /**
     * Render item with label or with content only
     * @default true
     */
    showTitle?: boolean;
}

export type SettingsContentProps = Omit<SettingsProps, 'loading' | 'renderLoading'>;
