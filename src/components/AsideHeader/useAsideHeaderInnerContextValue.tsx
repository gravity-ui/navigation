import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {AllPagesPanel, getAllPagesMenuItem} from '../AllPagesPanel';
import {MenuItem} from '../types';

import {AsideHeaderInnerContextType} from './AsideHeaderContext';
import {AsideHeaderProps, InnerPanels} from './types';

const EMPTY_MENU_ITEMS: MenuItem[] = [];

export const useAsideHeaderInnerContextValue = (
    props: AsideHeaderProps & {size: number},
): AsideHeaderInnerContextType => {
    const {size, onClosePanel, menuItems, panelItems, onMenuItemsChanged, onAllPagesClick} = props;
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
        (
            item: MenuItem,
            collapsed: boolean,
            event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        ) => {
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
        [allPagesIsAvailable, menuItems, innerVisiblePanel, ALL_PAGES_MENU_ITEM],
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
        panelItems: innerPanelItems,
        size,
        onItemClick,
    };
};
