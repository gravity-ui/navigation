import { j as jsxRuntimeExports } from '../../node_modules/react/jsx-runtime.mjs';
import React, { r as reactExports } from '../../node_modules/react/index.mjs';
import { InnerPanels } from './types.mjs';
import { getAllPagesMenuItem } from '../AllPagesPanel/constants.mjs';
import { AllPagesPanel } from '../AllPagesPanel/AllPagesPanel.mjs';

const EMPTY_MENU_ITEMS = [];
const useAsideHeaderInnerContextValue = (props) => {
  const { size, onClosePanel, menuItems, panelItems, onMenuItemsChanged } = props;
  const [innerVisiblePanel, setInnerVisiblePanel] = reactExports.useState();
  const ALL_PAGES_MENU_ITEM = React.useMemo(() => {
    return getAllPagesMenuItem();
  }, []);
  const allPagesIsAvailable = Boolean(onMenuItemsChanged) && (!menuItems || menuItems?.length > 0);
  reactExports.useEffect(() => {
    if (panelItems?.some((x) => x.visible)) {
      setInnerVisiblePanel(void 0);
    }
  }, [panelItems]);
  const innerOnClosePanel = reactExports.useCallback(() => {
    setInnerVisiblePanel(void 0);
    onClosePanel?.();
  }, [onClosePanel]);
  const onItemClick = reactExports.useCallback(
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
  const innerMenuItems = reactExports.useMemo(
    () => allPagesIsAvailable ? [
      ...menuItems || EMPTY_MENU_ITEMS,
      {
        ...ALL_PAGES_MENU_ITEM,
        current: innerVisiblePanel === InnerPanels.AllPages
      }
    ] : menuItems || EMPTY_MENU_ITEMS,
    [allPagesIsAvailable, menuItems, innerVisiblePanel, ALL_PAGES_MENU_ITEM]
  );
  const innerPanelItems = reactExports.useMemo(() => {
    if (!allPagesIsAvailable) {
      return panelItems;
    }
    return [
      ...panelItems || [],
      {
        id: InnerPanels.AllPages,
        content: /* @__PURE__ */ jsxRuntimeExports.jsx(AllPagesPanel, {}),
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
//# sourceMappingURL=useAsideHeaderInnerContextValue.mjs.map
