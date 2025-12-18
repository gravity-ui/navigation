import React, {useCallback, useMemo, useState} from 'react';
import type {ReactNode} from 'react';

import {Drawer, HelpMark, Hotkey, List, Text, TextInput} from '@gravity-ui/uikit';
import type {ListProps} from '@gravity-ui/uikit';

import {createBlock} from '../utils/cn';

import type {HotkeysGroup, HotkeysListItem} from './types';
import {filterHotkeys} from './utils/filterHotkeys';
import {flattenHotkeyGroups} from './utils/flattenHotkeyGroups';

import styles from './HotkeysPanel.module.scss';

const b = createBlock('hotkeys-panel', styles);

export type HotkeysPanelProps<T> = {
    hotkeys: HotkeysGroup<T>[];
    title?: ReactNode;
    togglePanelHotkey?: string;
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
    hotkeys,
    itemClassName,
    filterable = true,
    filterPlaceholder,
    title,
    togglePanelHotkey,
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
            <Text
                as={item.group ? ('h3' as const) : ('p' as const)}
                variant={item.group ? 'subheader-2' : 'body-1'}
                className={b(
                    'item-content',
                    {type: item.group ? 'group' : 'item'},
                    itemContentClassName,
                )}
                key={item.title}
            >
                <span>
                    {item.title}
                    {item.hint && (
                        <HelpMark
                            aria-hidden
                            popoverProps={{className: b('item-hint-tooltip')}}
                            className={b('item-hint')}
                        >
                            {item.hint}
                        </HelpMark>
                    )}
                </span>
                {item.value && <Hotkey className={b('hotkey')} value={item.value} />}
            </Text>
        ),
        [itemContentClassName],
    );

    const drawerItemContent = (
        <React.Fragment>
            <Text variant="subheader-3" as={'h2' as const} className={b('title', titleClassName)}>
                {title}
                {togglePanelHotkey && <Hotkey value={togglePanelHotkey} />}
            </Text>
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
                emptyPlaceholder={emptyState}
                {...listProps}
            />
        </React.Fragment>
    );

    return (
        <Drawer
            className={b(null, className)}
            open={visible}
            onOpenChange={(open) => !open && onClose?.()}
            style={{
                left: leftOffset,
                top: topOffset,
            }}
            contentClassName={b('drawer-item', drawerItemClassName)}
        >
            {drawerItemContent}
        </Drawer>
    );
}
