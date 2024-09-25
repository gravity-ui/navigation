'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const types = require('./types.cjs');
const constants = require('../AllPagesPanel/constants.cjs');
const AllPagesPanel = require('../AllPagesPanel/AllPagesPanel.cjs');

const EMPTY_MENU_ITEMS = [];
const useAsideHeaderInnerContextValue = (props) => {
  const { size, onClosePanel, menuItems, panelItems, onMenuItemsChanged } = props;
  const [innerVisiblePanel, setInnerVisiblePanel] = React.useState();
  const ALL_PAGES_MENU_ITEM = React.useMemo(() => {
    return constants.getAllPagesMenuItem();
  }, []);
  const allPagesIsAvailable = Boolean(onMenuItemsChanged) && (!menuItems || menuItems?.length > 0);
  React.useEffect(() => {
    if (panelItems?.some((x) => x.visible)) {
      setInnerVisiblePanel(void 0);
    }
  }, [panelItems]);
  const innerOnClosePanel = React.useCallback(() => {
    setInnerVisiblePanel(void 0);
    onClosePanel?.();
  }, [onClosePanel]);
  const onItemClick = React.useCallback(
    (item, collapsed, event) => {
      if (item.id === ALL_PAGES_MENU_ITEM.id) {
        onClosePanel?.();
        setInnerVisiblePanel(
          (prev) => prev === types.InnerPanels.AllPages ? void 0 : types.InnerPanels.AllPages
        );
      } else {
        innerOnClosePanel();
      }
      item.onItemClick?.(item, collapsed, event);
    },
    [innerOnClosePanel, ALL_PAGES_MENU_ITEM, onClosePanel]
  );
  const innerMenuItems = React.useMemo(
    () => allPagesIsAvailable ? [
      ...menuItems || EMPTY_MENU_ITEMS,
      {
        ...ALL_PAGES_MENU_ITEM,
        current: innerVisiblePanel === types.InnerPanels.AllPages
      }
    ] : menuItems || EMPTY_MENU_ITEMS,
    [allPagesIsAvailable, menuItems, innerVisiblePanel, ALL_PAGES_MENU_ITEM]
  );
  const innerPanelItems = React.useMemo(() => {
    if (!allPagesIsAvailable) {
      return panelItems;
    }
    return [
      ...panelItems || [],
      {
        id: types.InnerPanels.AllPages,
        content: /* @__PURE__ */ jsxRuntime.jsx(AllPagesPanel.AllPagesPanel, {}),
        visible: innerVisiblePanel === types.InnerPanels.AllPages
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

exports.useAsideHeaderInnerContextValue = useAsideHeaderInnerContextValue;
//# sourceMappingURL=useAsideHeaderInnerContextValue.cjs.map
