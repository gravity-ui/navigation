import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Button, Icon, List, ListItemData, Text, Flex} from '@gravity-ui/uikit';
import {Gear} from '@gravity-ui/icons';

import {block} from '../utils/cn';

import {useGroupedMenuItems} from './useGroupedMenuItems';
import {AllPagesListItem} from './AllPagesListItem';
import './AllPagesPanel.scss';

import i18n from './i18n';
import {MenuItem} from '../types';
import {useAsideHeaderInnerContext} from '../AsideHeader/AsideHeaderContext';
import {ALL_PAGES_ID} from './constants';

const b = block('all-pages-panel');

interface AllPagesPanelProps {
    className?: string;
    startEditIcon?: React.ReactNode;
    onEditModeChanged?: (isEditMode: boolean) => void;
}

export const AllPagesPanel: React.FC<AllPagesPanelProps> = (props) => {
    const {startEditIcon, onEditModeChanged, className} = props;
    const {menuItems, onMenuItemsChanged} = useAsideHeaderInnerContext();
    const menuItemsRef = useRef(menuItems);
    menuItemsRef.current = menuItems;

    const [isEditMode, setIsActive] = useState(false);
    const toggleEditMode = useCallback(() => {
        setIsActive((prev) => !prev);
    }, []);

    const groupedItems = useGroupedMenuItems(menuItems);

    useEffect(() => {
        onEditModeChanged?.(isEditMode);
    }, [isEditMode, onEditModeChanged]);

    const onItemClick = useCallback((item: ListItemData<MenuItem>) => {
        //@ts-ignore TODO
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
            onMenuItemsChanged(
                originItems.map((menuItem) => {
                    if (menuItem.id !== changedItem.id) {
                        return menuItem;
                    }
                    return changedItem;
                }),
            );
        },
        [onMenuItemsChanged],
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
