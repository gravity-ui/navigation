'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../node_modules/react/jsx-runtime.cjs');
const React = require('react');
const icons = require('@gravity-ui/icons');
const uikit = require('@gravity-ui/uikit');
const AsideHeaderContext = require('../AsideHeader/AsideHeaderContext.cjs');
const cn = require('../utils/cn.cjs');
const constants = require('./constants.cjs');
const index = require('./i18n/index.cjs');
const useGroupedMenuItems = require('./useGroupedMenuItems.cjs');
;/* empty css                     */
const AllPagesListItem = require('./AllPagesListItem/AllPagesListItem.cjs');

const b = cn.block("all-pages-panel");
const AllPagesPanel = (props) => {
  const { startEditIcon, onEditModeChanged, className } = props;
  const { menuItems, onMenuItemsChanged } = AsideHeaderContext.useAsideHeaderInnerContext();
  const menuItemsRef = React.useRef(menuItems);
  menuItemsRef.current = menuItems;
  const [isEditMode, setIsEditMode] = React.useState(false);
  const toggleEditMode = React.useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);
  const groupedItems = useGroupedMenuItems.useGroupedMenuItems(menuItems);
  React.useEffect(() => {
    onEditModeChanged?.(isEditMode);
  }, [isEditMode, onEditModeChanged]);
  const onItemClick = React.useCallback((item) => {
    item.onItemClick?.(item, false);
  }, []);
  const togglePageVisibility = React.useCallback(
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
  const itemRender = React.useCallback(
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
  const onResetToDefaultClick = React.useCallback(() => {
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
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(uikit.Flex, { className: b(null, className), gap: "5", direction: "column", children: [
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(uikit.Flex, { gap: "4", alignItems: "center", justifyContent: "space-between", children: [
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(uikit.Text, { variant: "subheader-2", children: isEditMode ? index.default("all-panel.title.editing") : index.default("all-panel.title.main") }),
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(uikit.Button, { selected: isEditMode, view: "normal", onClick: toggleEditMode, children: startEditIcon ? startEditIcon : /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(uikit.Icon, { data: icons.Gear }) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(uikit.Flex, { className: b("content"), gap: "5", direction: "column", children: Object.keys(groupedItems).map((category) => {
      return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(uikit.Flex, { direction: "column", gap: "3", children: [
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(uikit.Text, { className: b("category"), variant: "body-1", color: "secondary", children: category }),
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
          uikit.List,
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
    isEditMode && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(uikit.Button, { onClick: onResetToDefaultClick, children: index.default("all-panel.resetToDefault") })
  ] });
};

exports.AllPagesPanel = AllPagesPanel;
//# sourceMappingURL=AllPagesPanel.cjs.map
