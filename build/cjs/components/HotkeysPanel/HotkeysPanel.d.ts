import React from 'react';
import type { ReactNode } from 'react';
import type { ListProps } from '@gravity-ui/uikit';
import type { DrawerProps } from '../Drawer/Drawer';
import type { HotkeysGroup, HotkeysListItem } from './types';
import './HotkeysPanel.scss';
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
