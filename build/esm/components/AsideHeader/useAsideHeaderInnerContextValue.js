import React__default, { useState, useEffect, useCallback, useMemo } from 'react';
import { AllPagesPanel } from '../AllPagesPanel/AllPagesPanel.js';
import { getAllPagesMenuItem } from '../AllPagesPanel/constants.js';
import { InnerPanels } from './types.js';

const EMPTY_MENU_ITEMS = [];
const useAsideHeaderInnerContextValue = (props) => {
    const { size, onClosePanel, menuItems, panelItems, onMenuItemsChanged } = props;
    const [innerVisiblePanel, setInnerVisiblePanel] = useState();
    const ALL_PAGES_MENU_ITEM = React__default.useMemo(() => {
        return getAllPagesMenuItem();
    }, []);
    const allPagesIsAvailable = Boolean(onMenuItemsChanged) && (!menuItems || (menuItems === null || menuItems === void 0 ? void 0 : menuItems.length) > 0);
    useEffect(() => {
        // If any user panel became visible we need to switch off all inner panels
        if (panelItems === null || panelItems === void 0 ? void 0 : panelItems.some((x) => x.visible)) {
            setInnerVisiblePanel(undefined);
        }
    }, [panelItems]);
    const innerOnClosePanel = useCallback(() => {
        setInnerVisiblePanel(undefined);
        onClosePanel === null || onClosePanel === void 0 ? void 0 : onClosePanel();
    }, [onClosePanel]);
    const onItemClick = useCallback((item, collapsed, event) => {
        var _a;
        if (item.id === ALL_PAGES_MENU_ITEM.id) {
            onClosePanel === null || onClosePanel === void 0 ? void 0 : onClosePanel();
            setInnerVisiblePanel((prev) => prev === InnerPanels.AllPages ? undefined : InnerPanels.AllPages);
        }
        else {
            innerOnClosePanel();
        }
        (_a = item.onItemClick) === null || _a === void 0 ? void 0 : _a.call(item, item, collapsed, event);
    }, [innerOnClosePanel, ALL_PAGES_MENU_ITEM, onClosePanel]);
    const innerMenuItems = useMemo(() => allPagesIsAvailable
        ? [
            ...(menuItems || EMPTY_MENU_ITEMS),
            Object.assign(Object.assign({}, ALL_PAGES_MENU_ITEM), { current: innerVisiblePanel === InnerPanels.AllPages }),
        ]
        : menuItems || EMPTY_MENU_ITEMS, [allPagesIsAvailable, menuItems, innerVisiblePanel, ALL_PAGES_MENU_ITEM]);
    const innerPanelItems = useMemo(() => {
        if (!allPagesIsAvailable) {
            return panelItems;
        }
        return [
            ...(panelItems || []),
            {
                id: InnerPanels.AllPages,
                content: React__default.createElement(AllPagesPanel, null),
                visible: innerVisiblePanel === InnerPanels.AllPages,
            },
        ];
    }, [allPagesIsAvailable, panelItems, innerVisiblePanel]);
    return Object.assign(Object.assign({}, props), { onClosePanel: innerOnClosePanel, allPagesIsAvailable, menuItems: innerMenuItems, panelItems: innerPanelItems, size,
        onItemClick });
};

export { useAsideHeaderInnerContextValue };
//# sourceMappingURL=useAsideHeaderInnerContextValue.js.map
