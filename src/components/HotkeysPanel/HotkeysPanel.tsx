import React, {useCallback, useMemo, useState} from 'react';
import type {ReactNode} from 'react';

import {
    HelpMark,
    Hotkey,
    Icon,
    List,
    PlaceholderContainer,
    Text,
    TextInput,
} from '@gravity-ui/uikit';
import type {ListProps, PlaceholderContainerProps} from '@gravity-ui/uikit';

import {Drawer, DrawerItem} from '../Drawer/Drawer';
import {block} from '../utils/cn';

import i18n from './i18n';
import type {HotkeysGroup, HotkeysListItem} from './types';
import {filterHotkeys} from './utils/filterHotkeys';
import {flattenHotkeyGroups} from './utils/flattenHotkeyGroups';

import hotkeysEmptyScreen from '../../../assets/icons/hotkeys-empty-screen.svg';

import './HotkeysPanel.scss';

const b = block('hotkeys-panel');

export type HotkeysPanelProps<T> = {
    hotkeys: HotkeysGroup<T>[];
    title?: ReactNode;
    togglePanelHotkey?: string;
    filterable?: boolean;
    filterPlaceholder?: string;
    /**
     * hotkeys panel custom empty state if no search results
     *
     * @deprecated Use `emptyScreenProps` instead
     * */
    emptyState?: ReactNode;
    emptyScreenProps?: Partial<PlaceholderContainerProps>;
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
    emptyState: providedEmptyState,
    emptyScreenProps,
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

    const emptyState = useMemo(() => {
        if (providedEmptyState) {
            return providedEmptyState;
        }

        return (
            <PlaceholderContainer
                title={i18n('empty-screen-title')}
                description={i18n('empty-screen-description')}
                size="m"
                align="center"
                direction="column"
                image={<Icon data={hotkeysEmptyScreen} />}
                {...emptyScreenProps}
                className={b('empty-screen', emptyScreenProps?.className)}
            />
        );
    }, [providedEmptyState, emptyScreenProps]);

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
            onVeilClick={onClose}
            onEscape={onClose}
            style={{
                left: leftOffset,
                top: topOffset,
            }}
        >
            <DrawerItem
                id="hotkeys"
                visible={visible}
                className={b('drawer-item', drawerItemClassName)}
            >
                {drawerItemContent}
            </DrawerItem>
        </Drawer>
    );
}
