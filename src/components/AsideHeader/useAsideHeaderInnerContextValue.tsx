import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../constants';
import {AsideHeaderInnerContextType} from './AsideHeaderContext';
import {AsideHeaderProps, InnerPanels} from './types';
import {MenuItem} from '../types';
import {ALL_PAGES_MENU_ITEM, AllPagesPanel} from '../AllPagesPanel';

const EMPTY_MENU_ITEMS: MenuItem[] = [];

export const useAsideHeaderInnerContextValue = (
    props: AsideHeaderProps,
): AsideHeaderInnerContextType => {
    const {compact, onClosePanel, menuItems, panelItems, onMenuItemsChanged} = props;
    const [innerVisiblePanel, setInnerVisiblePanel] = useState<InnerPanels | undefined>();

    const size = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;
    const allPagesIsAvailable = Boolean(onMenuItemsChanged);

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
            innerOnClosePanel();
            item.onItemClick?.(item, collapsed, event);
        },
        [innerOnClosePanel],
    );

    const innerMenuItems = useMemo(
        () =>
            allPagesIsAvailable
                ? [
                      ...(menuItems || EMPTY_MENU_ITEMS),
                      {
                          ...ALL_PAGES_MENU_ITEM,
                          onItemClick: () => {
                              setInnerVisiblePanel(InnerPanels.AllPages);
                          },
                      },
                  ]
                : menuItems || EMPTY_MENU_ITEMS,
        [menuItems, allPagesIsAvailable],
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
