'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../node_modules/react/jsx-runtime.cjs');
const index = require('../../node_modules/react/index.cjs');
const AsideHeaderContext = require('../AsideHeader/AsideHeaderContext.cjs');
const cn = require('../utils/cn.cjs');
const constants = require('./constants.cjs');
const index$1 = require('./i18n/index.cjs');
const useGroupedMenuItems = require('./useGroupedMenuItems.cjs');
;/* empty css                     */
const AllPagesListItem = require('./AllPagesListItem/AllPagesListItem.cjs');
const Gear = require('../../node_modules/@gravity-ui/icons/esm/Gear.cjs');
const Flex = require('../../node_modules/@gravity-ui/uikit/build/esm/components/layout/Flex/Flex.cjs');
const Text = require('../../node_modules/@gravity-ui/uikit/build/esm/components/Text/Text.cjs');
const Button = require('../../node_modules/@gravity-ui/uikit/build/esm/components/Button/Button.cjs');
const Icon = require('../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.cjs');
const List = require('../../node_modules/@gravity-ui/uikit/build/esm/components/List/List.cjs');

const b = cn.block("all-pages-panel");
const AllPagesPanel = (props) => {
  const { startEditIcon, onEditModeChanged, className } = props;
  const { menuItems, onMenuItemsChanged } = AsideHeaderContext.useAsideHeaderInnerContext();
  const menuItemsRef = index.reactExports.useRef(menuItems);
  menuItemsRef.current = menuItems;
  const [isEditMode, setIsEditMode] = index.reactExports.useState(false);
  const toggleEditMode = index.reactExports.useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);
  const groupedItems = useGroupedMenuItems.useGroupedMenuItems(menuItems);
  index.reactExports.useEffect(() => {
    onEditModeChanged?.(isEditMode);
  }, [isEditMode, onEditModeChanged]);
  const onItemClick = index.reactExports.useCallback((item) => {
    item.onItemClick?.(item, false);
  }, []);
  const togglePageVisibility = index.reactExports.useCallback(
    (item) => {
      if (!onMenuItemsChanged) {
        return;
      }
      const changedItem = { ...item, hidden: !item.hidden };
      const originItems = menuItemsRef.current.filter(
        (menuItem) => menuItem.id !== constants.ALL_PAGES_ID
      );
      onMenuItemsChanged(
        originItems.map((menuItem) => {
          if (menuItem.id !== changedItem.id) {
            return menuItem;
          }
          return changedItem;
        })
      );
    },
    [onMenuItemsChanged]
  );
  const itemRender = index.reactExports.useCallback(
    (item, _isActive, _itemIndex) => /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
      AllPagesListItem.AllPagesListItem,
      {
        item,
        editMode: isEditMode,
        onToggle: () => togglePageVisibility(item)
      }
    ),
    [isEditMode, togglePageVisibility]
  );
  const onResetToDefaultClick = index.reactExports.useCallback(() => {
    if (!onMenuItemsChanged) {
      return;
    }
    const originItems = menuItemsRef.current.filter((item) => item.id !== constants.ALL_PAGES_ID);
    onMenuItemsChanged(
      originItems.map((item) => ({
        ...item,
        hidden: false
      }))
    );
  }, [onMenuItemsChanged]);
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(Flex.Flex, { className: b(null, className), gap: "5", direction: "column", children: [
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(Flex.Flex, { gap: "4", alignItems: "center", justifyContent: "space-between", children: [
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Text.Text, { variant: "subheader-2", children: isEditMode ? index$1.default("all-panel.title.editing") : index$1.default("all-panel.title.main") }),
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Button.Button, { selected: isEditMode, view: "normal", onClick: toggleEditMode, children: startEditIcon ? startEditIcon : /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Icon.Icon, { data: Gear.default }) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Flex.Flex, { className: b("content"), gap: "5", direction: "column", children: Object.keys(groupedItems).map((category) => {
      return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(Flex.Flex, { direction: "column", gap: "3", children: [
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Text.Text, { className: b("category"), variant: "body-1", color: "secondary", children: category }),
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
          List.List,
          {
            virtualized: false,
            filterable: false,
            items: groupedItems[category],
            onItemClick,
            renderItem: itemRender
          }
        )
      ] }, category);
    }) }),
    isEditMode && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Button.Button, { onClick: onResetToDefaultClick, children: index$1.default("all-panel.resetToDefault") })
  ] });
};

exports.AllPagesPanel = AllPagesPanel;
//# sourceMappingURL=AllPagesPanel.cjs.map
