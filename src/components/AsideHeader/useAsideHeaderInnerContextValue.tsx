import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {MenuItem} from '../types';

import {AsideHeaderInnerContextType} from './AsideHeaderContext';
import {AllPagesPanel, getAllPagesMenuItem} from './components/AllPagesPanel';
import {AsideHeaderItem, AsideHeaderProps, InnerPanels} from './types';

const EMPTY_MENU_ITEMS: AsideHeaderItem[] = [];

export const useAsideHeaderInnerContextValue = (
    props: AsideHeaderProps & {
        size: number;
        pinned: boolean;
        isExpanded: boolean;
        onExpand?: () => void;
        onFold?: () => void;
    },
): AsideHeaderInnerContextType => {
    const {
        size,
        onClosePanel,
        menuItems,
        menuGroups,
        defaultMenuGroups,
        panelItems,
        onMenuItemsChanged,
        onMenuGroupsChanged,
        onAllPagesClick,
    } = props;

    const [innerVisiblePanel, setInnerVisiblePanel] = useState<InnerPanels | undefined>();
    const ALL_PAGES_MENU_ITEM = React.useMemo(() => {
        return getAllPagesMenuItem();
    }, []);

    const allPagesIsAvailable =
        Boolean(onMenuItemsChanged) && (!menuItems || menuItems?.length > 0);

    useEffect(() => {
        // If any user panel became visible we need to switch off all inner panels
        if (panelItems?.some((x) => x.visible)) {
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

    const onToggleGroupCollapsed = useCallback(
        (groupId: string) => {
            const updatedMenuGroups = menuGroups?.map((group) => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        collapsed: !group.collapsed,
                    };
                }
                return group;
            });

            if (updatedMenuGroups) {
                onMenuGroupsChanged?.(updatedMenuGroups);
            }
        },
        [menuGroups, onMenuGroupsChanged],
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

    const innerPanelItems = useMemo(() => {
        if (!allPagesIsAvailable) {
            return panelItems;
        }
        return [
            ...(panelItems || []),
            {
                id: InnerPanels.AllPages,
                content: <AllPagesPanel />,
                visible: innerVisiblePanel === InnerPanels.AllPages,
            },
        ];
    }, [allPagesIsAvailable, panelItems, innerVisiblePanel]);

    return {
        ...props,
        onClosePanel: innerOnClosePanel,
        allPagesIsAvailable,
        menuItems: innerMenuItems,
        menuGroups,
        defaultMenuGroups,
        onMenuGroupsChanged,
        panelItems: innerPanelItems,
        size,
        onItemClick,
        onToggleGroupCollapsed,
    };
};
