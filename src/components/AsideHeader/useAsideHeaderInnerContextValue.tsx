import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {MenuItem} from '../types';

import {AsideHeaderInnerContextType} from './AsideHeaderContext';
import {AllPagesPanel, getAllPagesMenuItem} from './components/AllPagesPanel';
import {
    AsideHeaderItem,
    AsideHeaderProps,
    InnerPanels,
    PanelItemProps,
    SetCollapseBlocker,
} from './types';

const EMPTY_MENU_ITEMS: AsideHeaderItem[] = [];

export const useAsideHeaderInnerContextValue = (
    props: AsideHeaderProps & {
        size: number;
        pinned: boolean;
        isExpanded: boolean;
        onExpand?: () => void;
        onFold?: () => void;
        setCollapseBlocker?: SetCollapseBlocker;
    },
): AsideHeaderInnerContextType => {
    const {
        size,
        onClosePanel,
        menuItems,
        menuGroups,
        defaultMenuGroups,
        panelItems,
        isCompactMode = false,
        setCollapseBlocker,
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
        (
            item: MenuItem,
            collapsed: boolean,
            event: React.MouseEvent<HTMLElement, MouseEvent>,
            options: {setCollapseBlocker: SetCollapseBlocker | undefined},
        ) => {
            if (item.id === ALL_PAGES_MENU_ITEM.id) {
                onClosePanel?.();
                setInnerVisiblePanel((prev) =>
                    prev === InnerPanels.AllPages ? undefined : InnerPanels.AllPages,
                );
            } else {
                innerOnClosePanel();
            }
            item.onItemClick?.(item, collapsed, event, options);
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
            },
        ];
    }, [allPagesIsAvailable, panelItems, innerVisiblePanel]);

    const hasPanelOpen = innerPanelItems?.some((p) => p.open) ?? false;

    useEffect(() => {
        if (hasPanelOpen) {
            setCollapseBlocker?.(true);
        } else {
            setCollapseBlocker?.(false);
        }

        return () => {
            setCollapseBlocker?.(false);
        };
    }, [hasPanelOpen, setCollapseBlocker]);

    return {
        ...props,
        setCollapseBlocker,
        isCompactMode,
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
