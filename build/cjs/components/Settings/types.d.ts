import { IconProps } from '@gravity-ui/uikit';
export interface GroupItem {
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
export {};
