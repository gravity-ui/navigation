import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {MenuItem} from '../types';

import {AsideHeaderInnerContextType} from './AsideHeaderContext';
import {AllPagesPanel, getAllPagesMenuItem} from './components/AllPagesPanel';
import {isQuickAccessPinEligible} from './quickAccess';
import {AsideHeaderItem, AsideHeaderProps, InnerPanels, PanelItemProps} from './types';

const EMPTY_MENU_ITEMS: AsideHeaderItem[] = [];

export const useAsideHeaderInnerContextValue = (
    props: AsideHeaderProps & {size: number},
): AsideHeaderInnerContextType => {
    const {
        size,
        onClosePanel,
        menuItems,
        panelItems,
        onMenuItemsChanged,
        onAllPagesClick,
        enableQuickAccess,
        showQuickAccessSection = true,
        enableAllPages = true,
        editMenuProps,
    } = props;
    const [innerVisiblePanel, setInnerVisiblePanel] = useState<InnerPanels | undefined>();
    const menuItemsRef = useRef(menuItems);
    menuItemsRef.current = menuItems;

    const ALL_PAGES_MENU_ITEM = React.useMemo(() => {
        return getAllPagesMenuItem();
    }, []);

    const allPagesIsAvailable =
        enableAllPages && Boolean(onMenuItemsChanged) && (!menuItems || menuItems?.length > 0);

    const quickAccessIsAvailable =
        Boolean(enableQuickAccess) && Boolean(onMenuItemsChanged) && showQuickAccessSection;

    useEffect(() => {
        // If any user panel became open we need to switch off all inner panels
        if (panelItems?.some((x) => x.open)) {
            setInnerVisiblePanel(undefined);
        }
    }, [panelItems]);

    const innerOnClosePanel = useCallback(() => {
        setInnerVisiblePanel(undefined);
        onClosePanel?.();
    }, [onClosePanel]);

    const onItemClick = useCallback(
        (item: MenuItem, collapsed: boolean, event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            if (item.id === ALL_PAGES_MENU_ITEM.id) {
                onClosePanel?.();
                setInnerVisiblePanel((prev) =>
                    prev === InnerPanels.AllPages ? undefined : InnerPanels.AllPages,
                );
            } else {
                innerOnClosePanel();
            }
            item.onItemClick?.(item, collapsed, event);
        },
        [innerOnClosePanel, ALL_PAGES_MENU_ITEM, onClosePanel],
    );

    const onToggleQuickAccess = useCallback(
        (item: AsideHeaderItem) => {
            if (!quickAccessIsAvailable || !onMenuItemsChanged) {
                return;
            }

            if (!isQuickAccessPinEligible(item)) {
                return;
            }

            const originItems = (menuItemsRef.current || EMPTY_MENU_ITEMS).filter(
                (menuItem) => menuItem.id !== ALL_PAGES_MENU_ITEM.id,
            );
            const originItem = originItems.find((menuItem) => menuItem.id === item.id);

            if (!originItem) {
                return;
            }

            const changedItem: AsideHeaderItem = {
                ...originItem,
                quickAccess: !originItem.quickAccess,
            };

            editMenuProps?.onToggleQuickAccess?.(changedItem);
            onMenuItemsChanged(
                originItems.map((menuItem) =>
                    menuItem.id === changedItem.id ? changedItem : menuItem,
                ),
            );
        },
        [quickAccessIsAvailable, onMenuItemsChanged, ALL_PAGES_MENU_ITEM.id, editMenuProps],
    );

    const innerMenuItems = useMemo(
        () =>
            allPagesIsAvailable
                ? [
                      ...(menuItems || EMPTY_MENU_ITEMS),
                      {
                          ...ALL_PAGES_MENU_ITEM,
                          current: innerVisiblePanel === InnerPanels.AllPages,
                          onItemClick: onAllPagesClick,
                      },
                  ]
                : menuItems || EMPTY_MENU_ITEMS,
        [allPagesIsAvailable, menuItems, innerVisiblePanel, ALL_PAGES_MENU_ITEM, onAllPagesClick],
    );

    const innerPanelItems = useMemo<PanelItemProps[] | undefined>(() => {
        if (!allPagesIsAvailable) {
            return panelItems;
        }

        return [
            ...(panelItems || []),
            {
                id: InnerPanels.AllPages,
                children: <AllPagesPanel />,
                open: innerVisiblePanel === InnerPanels.AllPages,
                size: 'auto',
            },
        ];
    }, [allPagesIsAvailable, panelItems, innerVisiblePanel]);

    return {
        ...props,
        menuDensity: props.menuDensity ?? 'default',
        onClosePanel: innerOnClosePanel,
        allPagesIsAvailable,
        quickAccessIsAvailable,
        menuItems: innerMenuItems,
        panelItems: innerPanelItems,
        size,
        onItemClick,
        onToggleQuickAccess,
    };
};
