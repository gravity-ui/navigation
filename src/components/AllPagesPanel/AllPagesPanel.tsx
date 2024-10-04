import React, {useCallback, useEffect, useRef, useState} from 'react';

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
    const toggleEditMode = useCallback(() => {
        setIsEditMode((prev) => !prev);
    }, []);

    const groupedItems = useGroupedMenuItems(menuItems);

    useEffect(() => {
        onEditModeChanged?.(isEditMode);

        if (isEditMode) {
            editMenuProps.onOpenEditMode?.();
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
            editMenuProps.onToggleMenuItem?.(changedItem);
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

    const itemRender = useCallback(
        (item: ListItemData<MenuItem>, _isActive: boolean, _itemIndex: number) => (
            <AllPagesListItem
                item={item}
                editMode={isEditMode}
                onToggle={() => togglePageVisibility(item)}
            />
        ),
        [isEditMode, togglePageVisibility],
    );

    const onResetToDefaultClick = useCallback(() => {
        if (!onMenuItemsChanged) {
            return;
        }
        editMenuProps.onResetSettingsToDefault?.();
        const originItems = menuItemsRef.current.filter((item) => item.id !== ALL_PAGES_ID);
        onMenuItemsChanged(
            originItems.map((item) => ({
                ...item,
                hidden: false,
            })),
        );
    }, [onMenuItemsChanged]);
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
                {Object.keys(groupedItems).map((category) => {
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
                })}
            </Flex>
            {isEditMode && (
                <Button onClick={onResetToDefaultClick}>{i18n('all-panel.resetToDefault')}</Button>
            )}
        </Flex>
    );
};
