import React, {useCallback, useMemo, useState} from 'react';
import type {ReactNode} from 'react';

import {Hotkey, List, TextInput} from '@gravity-ui/uikit';
import type {ListProps} from '@gravity-ui/uikit';

import {Drawer, DrawerItem} from '../Drawer/Drawer';
import type {DrawerProps} from '../Drawer/Drawer';
import {block} from '../utils/cn';

import type {HotkeysGroup, HotkeysListItem} from './types';
import {filterHotkeys} from './utils/filterHotkeys';
import {flattenHotkeyGroups} from './utils/flattenHotkeyGroups';

import './HotkeysPanel.scss';

const b = block('hotkeys-panel');

export type HotkeysPanelProps<T> = {
    hotkeys: HotkeysGroup<T>[];
    title?: ReactNode;
    filterable?: boolean;
    filterPlaceholder?: string;
    emptyState?: ReactNode;
    visible: boolean;
    onClose?: () => void;
    className?: string;
    drawerItemClassName?: string;
    filterClassName?: string;
    titleClassName?: string;
    itemContentClassName?: string;
    listClassName?: string;
    leftOffset?: number | string;
    topOffset?: number | string;
    preventScrollBody?: DrawerProps['preventScrollBody'];
} & Omit<
    ListProps<HotkeysListItem>,
    | 'items'
    | 'emptyPlaceholder'
    | 'className'
    | 'size'
    | 'renderItem'
    | 'filterable'
    | 'autoFocus'
    | 'filterPlaceholder'
    | 'filterClassName'
    | 'filter'
    | 'filterItem'
    | 'onFilterEnd'
    | 'onFilterUpdate'
>;

export function HotkeysPanel<T = {}>({
    visible,
    onClose,
    leftOffset,
    topOffset,
    className,
    drawerItemClassName,
    filterClassName,
    titleClassName,
    listClassName,
    itemContentClassName,
    preventScrollBody,
    hotkeys,
    itemClassName,
    filterable = true,
    filterPlaceholder,
    title,
    emptyState,
    ...listProps
}: HotkeysPanelProps<T>) {
    const [filter, setFilter] = useState('');

    const hotkeysList = useMemo(() => {
        const filteredHotkeys = filterHotkeys(hotkeys, filter);
        return flattenHotkeyGroups(filteredHotkeys);
    }, [hotkeys, filter]);

    const renderItem = useCallback(
        (item: HotkeysListItem) => (
            <div
                className={b('item-content', {group: item.group}, itemContentClassName)}
                key={item.title}
            >
                {item.title}
                {item.value && <Hotkey className={b('hotkey')} value={item.value} />}
            </div>
        ),
        [],
    );

    const drawerItemContent = (
        <React.Fragment>
            <h2 className={b('title', titleClassName)}>{title}</h2>
            {filterable && (
                <TextInput
                    value={filter}
                    onUpdate={setFilter}
                    placeholder={filterPlaceholder}
                    autoFocus
                    className={b('search', filterClassName)}
                    hasClear
                />
            )}
            <List<HotkeysListItem>
                className={b('list', listClassName)}
                virtualized={false}
                filterable={false}
                items={hotkeysList}
                renderItem={renderItem}
                itemClassName={b('item', itemClassName)}
                emptyPlaceholder={emptyState as string}
                {...listProps}
            />
        </React.Fragment>
    );

    return (
        <Drawer
            className={b(null, className)}
            onVeilClick={onClose}
            onEscape={onClose}
            preventScrollBody={preventScrollBody}
            style={{
                left: leftOffset,
                top: topOffset,
            }}
        >
            <DrawerItem
                id="hotkeys"
                visible={visible}
                className={b('drawer-item', drawerItemClassName)}
                content={drawerItemContent}
            />
        </Drawer>
    );
}
