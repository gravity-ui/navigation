import React, {ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {Gear} from '@gravity-ui/icons';
import {Button, Flex, Icon, List, ListItemData, Text} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeader/AsideHeaderContext';
import {MenuItem} from '../types';
import {block} from '../utils/cn';

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
    const {menuItems, onMenuItemsChanged, editMenuProps} = useAsideHeaderInnerContext();

    const menuItemsRef = useRef(menuItems);
    menuItemsRef.current = menuItems;

    const [isEditMode, setIsEditMode] = useState(false);

    const [dragingItemTitle, setDragingItemTitle] = useState<ReactNode | null>(null);

    const toggleEditMode = useCallback(() => {
        setIsEditMode((prev) => !prev);
    }, []);

    const groupedItems = useGroupedMenuItems(menuItems);

    useEffect(() => {
        onEditModeChanged?.(isEditMode);

        if (isEditMode) {
            editMenuProps?.onOpenEditMode?.();
        }
    }, [isEditMode, onEditModeChanged, editMenuProps]);

    const onItemClick = useCallback((item: ListItemData<MenuItem>) => {
        //@ts-ignore TODO fix when @gravity-ui/uikit/List will provide event arg on item click
        item.onItemClick?.(item, false);
    }, []);

    const togglePageVisibility = useCallback(
        (item: MenuItem) => {
            if (!onMenuItemsChanged) {
                return;
            }
            const changedItem: MenuItem = {...item, hidden: !item.hidden};

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
        setDragingItemTitle(null);
    }, [onMenuItemsChanged]);

    const itemRender = useCallback(
        (item: ListItemData<MenuItem>, _isActive: boolean, _itemIndex: number) => {
            const onDragStart = () => {
                setDragingItemTitle(item.title);
            };

            return (
                <AllPagesListItem
                    item={item}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    editMode={isEditMode}
                    onToggle={() => togglePageVisibility(item)}
                    enableSorting={editMenuProps?.enableSorting}
                />
            );
        },
        [isEditMode, togglePageVisibility, onMenuItemsChanged],
    );

    const onResetToDefaultClick = useCallback(() => {
        if (!onMenuItemsChanged) {
            return;
        }
        editMenuProps?.onResetSettingsToDefault?.();
        const originItems = menuItemsRef.current.filter((item) => item.id !== ALL_PAGES_ID);
        onMenuItemsChanged(
            originItems.map((item) => ({
                ...item,
                hidden: false,
            })),
        );
    }, [onMenuItemsChanged, editMenuProps]);

    const changeItemsOrder = useCallback(
        ({oldIndex, newIndex}: {oldIndex: number; newIndex: number}) => {
            const newItems = menuItemsRef.current.filter((item) => item.id !== ALL_PAGES_ID);

            const element = newItems.splice(oldIndex, 1)[0];
            newItems.splice(newIndex, 0, element);

            onMenuItemsChanged?.(newItems);

            setDragingItemTitle(null);
            editMenuProps?.onChangeItemsOrder?.(element, oldIndex, newIndex);
        },
        [onMenuItemsChanged],
    );

    const sortableItems = useMemo(() => {
        return menuItemsRef.current.filter(
            (item) => item.id !== ALL_PAGES_ID && !item.afterMoreButton,
        );
    }, [menuItemsRef.current]);

    return (
        <Flex className={b(null, className)} gap="5" direction="column">
            <Flex gap="4" alignItems="center" justifyContent="space-between">
                <Text variant="subheader-2">
                    {isEditMode ? i18n('all-panel.title.editing') : i18n('all-panel.title.main')}
                </Text>
                <Button selected={isEditMode} view="normal" onClick={toggleEditMode}>
                    {startEditIcon ? startEditIcon : <Icon data={Gear} />}
                </Button>
            </Flex>
            <Flex className={b('content')} gap="5" direction="column">
                {isEditMode && editMenuProps?.enableSorting ? (
                    <div>
                        <List
                            itemClassName={b('item', {editMode: true})}
                            itemHeight={40}
                            onSortEnd={changeItemsOrder}
                            sortable
                            virtualized={false}
                            filterable={false}
                            items={sortableItems}
                            onItemClick={onItemClick}
                            renderItem={itemRender}
                        />

                        {dragingItemTitle && (
                            <div className={b('drag-placeholder')}>{dragingItemTitle}</div>
                        )}
                    </div>
                ) : (
                    Object.keys(groupedItems).map((category) => {
                        return (
                            <Flex key={category} direction="column" gap="3">
                                <Text className={b('category')} variant="body-1" color="secondary">
                                    {category}
                                </Text>
                                <List
                                    virtualized={false}
                                    filterable={false}
                                    items={groupedItems[category]}
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
