import { default as React, ReactNode } from 'react';
import { ListProps } from '@gravity-ui/uikit';
import { DrawerProps } from '../Drawer/Drawer';
import { HotkeysGroup, HotkeysListItem } from './types';
export type HotkeysPanelProps<T> = {
    hotkeys: HotkeysGroup<T>[];
    title?: ReactNode;
    filterPlaceholder?: string;
    emptyState?: ReactNode;
    visible: boolean;
    onClose?: () => void;
    className?: string;
    leftOffset?: number | string;
    topOffset?: number | string;
    preventScrollBody?: DrawerProps['preventScrollBody'];
} & Omit<ListProps<HotkeysListItem>, 'items' | 'emptyPlaceholder'>;
export declare function HotkeysPanel<T = {}>({ visible, onClose, leftOffset, topOffset, className, preventScrollBody, hotkeys, itemClassName, filterPlaceholder, title, emptyState, ...listProps }: HotkeysPanelProps<T>): React.JSX.Element;
