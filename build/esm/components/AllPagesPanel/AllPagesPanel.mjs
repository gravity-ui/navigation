import { j as jsxRuntimeExports } from '../../node_modules/react/jsx-runtime.mjs';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Gear } from '@gravity-ui/icons';
import { Flex, Text, Button, Icon, List } from '@gravity-ui/uikit';
import { useAsideHeaderInnerContext } from '../AsideHeader/AsideHeaderContext.mjs';
import { block } from '../utils/cn.mjs';
import { ALL_PAGES_ID } from './constants.mjs';
import i18n from './i18n/index.mjs';
import { useGroupedMenuItems } from './useGroupedMenuItems.mjs';
/* empty css                    */
import { AllPagesListItem } from './AllPagesListItem/AllPagesListItem.mjs';

const b = block("all-pages-panel");
const AllPagesPanel = (props) => {
  const { startEditIcon, onEditModeChanged, className } = props;
  const { menuItems, onMenuItemsChanged } = useAsideHeaderInnerContext();
  const menuItemsRef = useRef(menuItems);
  menuItemsRef.current = menuItems;
  const [isEditMode, setIsEditMode] = useState(false);
  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);
  const groupedItems = useGroupedMenuItems(menuItems);
  useEffect(() => {
    onEditModeChanged?.(isEditMode);
  }, [isEditMode, onEditModeChanged]);
  const onItemClick = useCallback((item) => {
    item.onItemClick?.(item, false);
  }, []);
  const togglePageVisibility = useCallback(
    (item) => {
      if (!onMenuItemsChanged) {
        return;
      }
      const changedItem = { ...item, hidden: !item.hidden };
      const originItems = menuItemsRef.current.filter(
        (menuItem) => menuItem.id !== ALL_PAGES_ID
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
  const itemRender = useCallback(
    (item, _isActive, _itemIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      AllPagesListItem,
      {
        item,
        editMode: isEditMode,
        onToggle: () => togglePageVisibility(item)
      }
    ),
    [isEditMode, togglePageVisibility]
  );
  const onResetToDefaultClick = useCallback(() => {
    if (!onMenuItemsChanged) {
      return;
    }
    const originItems = menuItemsRef.current.filter((item) => item.id !== ALL_PAGES_ID);
    onMenuItemsChanged(
      originItems.map((item) => ({
        ...item,
        hidden: false
      }))
    );
  }, [onMenuItemsChanged]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Flex, { className: b(null, className), gap: "5", direction: "column", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Flex, { gap: "4", alignItems: "center", justifyContent: "space-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { variant: "subheader-2", children: isEditMode ? i18n("all-panel.title.editing") : i18n("all-panel.title.main") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { selected: isEditMode, view: "normal", onClick: toggleEditMode, children: startEditIcon ? startEditIcon : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { data: Gear }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Flex, { className: b("content"), gap: "5", direction: "column", children: Object.keys(groupedItems).map((category) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Flex, { direction: "column", gap: "3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { className: b("category"), variant: "body-1", color: "secondary", children: category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          List,
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
    isEditMode && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onResetToDefaultClick, children: i18n("all-panel.resetToDefault") })
  ] });
};

export { AllPagesPanel };
//# sourceMappingURL=AllPagesPanel.mjs.map
