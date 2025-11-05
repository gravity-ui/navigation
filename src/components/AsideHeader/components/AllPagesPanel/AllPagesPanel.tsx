import React, {ReactNode, useCallback, useEffect, useRef, useState} from 'react';

import {Gear} from '@gravity-ui/icons';
import {Button, Flex, Icon, List, ListItemData, ListProps, Text, Tooltip} from '@gravity-ui/uikit';

import {block} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import {AsideHeaderItem} from '../../types';

import {AllPagesGroupHeader} from './AllPagesGroupHeader';
import {AllPagesListItem} from './AllPagesListItem';
import {ALL_PAGES_ID} from './constants';
import i18n from './i18n';
import {useGroupedMenuItems} from './useGroupedMenuItems';

import './AllPagesPanel.scss';

const b = block('all-pages-panel');

interface AllPagesPanelProps {
    className?: string;
    startEditIcon?: React.ReactNode;
    onEditModeChanged?: (isEditMode: boolean) => void;
}

export const AllPagesPanel: React.FC<AllPagesPanelProps> = (props) => {
    const {startEditIcon, onEditModeChanged, className} = props;
    const {
        defaultMenuItems,
        onMenuItemsChanged,
        editMenuProps,
        menuItems,
        menuGroups,
        defaultMenuGroups,
        onMenuGroupsChanged,
    } = useAsideHeaderInnerContext();

    const groupedItems = useGroupedMenuItems(menuItems, menuGroups, false);
    const items = groupedItems.flatMap((group) => group.items);

    const menuItemsRef = useRef(items);
    menuItemsRef.current = items;

    const menuGroupsRef = useRef(menuGroups);
    menuGroupsRef.current = menuGroups;

    const [isEditMode, setIsEditMode] = useState(false);

    const [draggingItemTitle, setDraggingItemTitle] = useState<ReactNode | null>(null);

    const toggleEditMode = useCallback(() => {
        setIsEditMode((prev) => !prev);
    }, []);

    useEffect(() => {
        onEditModeChanged?.(isEditMode);

        if (isEditMode) {
            editMenuProps?.onOpenEditMode?.();
        }
    }, [isEditMode, onEditModeChanged, editMenuProps]);

    const onItemClick = useCallback<NonNullable<ListProps<AsideHeaderItem>['onItemClick']>>(
        (item, _index, _forwardKey, event) => {
            // TODO: make event an optional argument
            item.onItemClick?.(item, false, event as React.MouseEvent<HTMLElement, MouseEvent>);
        },
        [],
    );

    const togglePageVisibility = useCallback(
        (item: AsideHeaderItem) => {
            if (!onMenuItemsChanged) {
                return;
            }
            const changedItem: AsideHeaderItem = {
                ...item,
                hidden: !item.hidden,
            };

            const originItems = menuItemsRef.current.filter(
                (menuItem) => menuItem.id !== ALL_PAGES_ID,
            );

            editMenuProps?.onToggleMenuItem?.(changedItem);
            onMenuItemsChanged(
                originItems.map((menuItem) => {
                    if (menuItem.id !== changedItem.id) {
                        return menuItem;
                    }
                    return changedItem;
                }),
            );
        },
        [onMenuItemsChanged, editMenuProps],
    );

    const onDragEnd = useCallback(() => {
        setDraggingItemTitle(null);
    }, [setDraggingItemTitle]);

    const itemRender = useCallback(
        (
            asideHeaderItem: ListItemData<AsideHeaderItem>,
            _isActive: boolean,
            _itemIndex: number,
        ) => {
            const onDragStart = () => {
                setDraggingItemTitle(asideHeaderItem.title);
            };

            return (
                <AllPagesListItem
                    item={asideHeaderItem}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    editMode={isEditMode}
                    onToggle={() => togglePageVisibility(asideHeaderItem)}
                    enableSorting={editMenuProps?.enableSorting}
                />
            );
        },
        [isEditMode, togglePageVisibility, onDragEnd, setDraggingItemTitle, editMenuProps],
    );

    const onResetToDefaultClick = useCallback(() => {
        if (!onMenuItemsChanged) {
            return;
        }
        editMenuProps?.onResetSettingsToDefault?.();
        const originItems = defaultMenuItems?.filter(({id}) => id !== ALL_PAGES_ID);

        if (originItems) {
            onMenuItemsChanged(originItems);
        }

        if (onMenuGroupsChanged && defaultMenuGroups) {
            onMenuGroupsChanged(defaultMenuGroups);
        }
    }, [
        onMenuItemsChanged,
        editMenuProps,
        defaultMenuItems,
        onMenuGroupsChanged,
        defaultMenuGroups,
    ]);

    const toggleGroupHidden = useCallback(
        (groupId: string) => {
            if (!onMenuGroupsChanged) {
                return;
            }

            const currentGroups = menuGroupsRef.current || [];
            const updatedGroups = currentGroups.map((group) => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        hidden: !group.hidden,
                    };
                }

                return group;
            });

            onMenuGroupsChanged(updatedGroups);
        },
        [onMenuGroupsChanged],
    );

    const changeItemsOrder = useCallback(
        ({oldIndex, newIndex}: {oldIndex: number; newIndex: number}) => {
            const newItems = menuItemsRef.current.filter(({id}) => id !== ALL_PAGES_ID);

            const element = newItems.splice(oldIndex, 1)[0];
            newItems.splice(newIndex, 0, element);

            onMenuItemsChanged?.(newItems.filter(({type}) => type !== 'divider'));

            setDraggingItemTitle(null);
            editMenuProps?.onChangeItemsOrder?.(element, oldIndex, newIndex);
        },
        [onMenuItemsChanged, editMenuProps],
    );

    return (
        <Flex className={b(null, className)} gap="5" direction="column">
            <Flex gap="4" alignItems="center" justifyContent="space-between">
                <Text variant="subheader-2">
                    {isEditMode ? i18n('all-panel.title.editing') : i18n('all-panel.title.main')}
                </Text>

                <Tooltip content={i18n('all-panel.title.editing')}>
                    <Button selected={isEditMode} view="normal" onClick={toggleEditMode}>
                        {startEditIcon ? startEditIcon : <Icon data={Gear} />}
                    </Button>
                </Tooltip>
            </Flex>

            <Flex className={b('content')} gap="2" direction="column">
                {isEditMode && editMenuProps?.enableSorting ? (
                    <>
                        {groupedItems.map((groupWithItems) => {
                            const sortableGroupItems = groupWithItems.items.filter(
                                ({id, afterMoreButton, type}) =>
                                    !afterMoreButton && type !== 'divider' && id !== ALL_PAGES_ID,
                            );

                            if (sortableGroupItems.length === 0) {
                                return null;
                            }

                            return (
                                <Flex
                                    className={b('groups-container')}
                                    key={groupWithItems.id}
                                    direction="column"
                                    gap="3"
                                >
                                    <AllPagesGroupHeader
                                        id={groupWithItems.id}
                                        icon={groupWithItems.icon}
                                        title={groupWithItems.title}
                                        hidden={Boolean(groupWithItems.hidden)}
                                        onToggleHidden={toggleGroupHidden}
                                        editMode={isEditMode}
                                    />
                                    {sortableGroupItems.length > 0 && (
                                        <List
                                            itemClassName={b('item', {editMode: true})}
                                            itemHeight={40}
                                            onSortEnd={changeItemsOrder}
                                            sortable
                                            virtualized={false}
                                            filterable={false}
                                            items={sortableGroupItems}
                                            onItemClick={onItemClick}
                                            renderItem={itemRender}
                                        />
                                    )}
                                </Flex>
                            );
                        })}

                        {draggingItemTitle && (
                            <div className={b('drag-placeholder')}>{draggingItemTitle}</div>
                        )}
                    </>
                ) : (
                    groupedItems.map((groupWithItems) => {
                        if (groupWithItems.items.length === 0) {
                            return null;
                        }

                        return (
                            <Flex
                                key={groupWithItems.id}
                                direction="column"
                                gap="3"
                                className={b('groups-container')}
                            >
                                {groupWithItems.title && (
                                    <AllPagesGroupHeader
                                        id={groupWithItems.id}
                                        icon={groupWithItems.icon}
                                        title={groupWithItems.title}
                                        hidden={Boolean(groupWithItems.hidden)}
                                        onToggleHidden={toggleGroupHidden}
                                        editMode={isEditMode}
                                    />
                                )}

                                <List
                                    virtualized={false}
                                    filterable={false}
                                    items={groupWithItems.items}
                                    onItemClick={onItemClick}
                                    renderItem={itemRender}
                                />
                            </Flex>
                        );
                    })
                )}
            </Flex>
            {isEditMode && (
                <Button onClick={onResetToDefaultClick}>{i18n('all-panel.resetToDefault')}</Button>
            )}
        </Flex>
    );
};
