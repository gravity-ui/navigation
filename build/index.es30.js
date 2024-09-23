import { jsx } from 'react/jsx-runtime';
import React__default, { useState, useEffect, useCallback, useMemo } from 'react';
import { InnerPanels } from './index.es69.js';
import { getAllPagesMenuItem } from './index.es70.js';
import { AllPagesPanel } from './index.es71.js';

const EMPTY_MENU_ITEMS = [];
const useAsideHeaderInnerContextValue = (props) => {
  const { size, onClosePanel, menuItems, panelItems, onMenuItemsChanged } = props;
  const [innerVisiblePanel, setInnerVisiblePanel] = useState();
  const ALL_PAGES_MENU_ITEM = React__default.useMemo(() => {
    return getAllPagesMenuItem();
  }, []);
  const allPagesIsAvailable = Boolean(onMenuItemsChanged) && (!menuItems || menuItems?.length > 0);
  useEffect(() => {
    if (panelItems?.some((x) => x.visible)) {
      setInnerVisiblePanel(void 0);
    }
  }, [panelItems]);
  const innerOnClosePanel = useCallback(() => {
    setInnerVisiblePanel(void 0);
    onClosePanel?.();
  }, [onClosePanel]);
  const onItemClick = useCallback(
    (item, collapsed, event) => {
      if (item.id === ALL_PAGES_MENU_ITEM.id) {
        onClosePanel?.();
        setInnerVisiblePanel(
          (prev) => prev === InnerPanels.AllPages ? void 0 : InnerPanels.AllPages
        );
      } else {
        innerOnClosePanel();
      }
      item.onItemClick?.(item, collapsed, event);
    },
    [innerOnClosePanel, ALL_PAGES_MENU_ITEM, onClosePanel]
  );
  const innerMenuItems = useMemo(
    () => allPagesIsAvailable ? [
      ...menuItems || EMPTY_MENU_ITEMS,
      {
        ...ALL_PAGES_MENU_ITEM,
        current: innerVisiblePanel === InnerPanels.AllPages
      }
    ] : menuItems || EMPTY_MENU_ITEMS,
    [allPagesIsAvailable, menuItems, innerVisiblePanel, ALL_PAGES_MENU_ITEM]
  );
  const innerPanelItems = useMemo(() => {
    if (!allPagesIsAvailable) {
      return panelItems;
    }
    return [
      ...panelItems || [],
      {
        id: InnerPanels.AllPages,
        content: /* @__PURE__ */ jsx(AllPagesPanel, {}),
        visible: innerVisiblePanel === InnerPanels.AllPages
      }
    ];
  }, [allPagesIsAvailable, panelItems, innerVisiblePanel]);
  return {
    ...props,
    onClosePanel: innerOnClosePanel,
    allPagesIsAvailable,
    menuItems: innerMenuItems,
    panelItems: innerPanelItems,
    size,
    onItemClick
  };
};

export { useAsideHeaderInnerContextValue };
//# sourceMappingURL=index.es30.js.map
