import { j as jsxRuntimeExports } from '../../node_modules/react/jsx-runtime.mjs';
import React, { r as reactExports } from '../../node_modules/react/index.mjs';
import { Drawer, DrawerItem } from '../Drawer/Drawer.mjs';
import { block } from '../utils/cn.mjs';
import { filterHotkeys } from './utils/filterHotkeys.mjs';
import { flattenHotkeyGroups } from './utils/flattenHotkeyGroups.mjs';
/* empty css                   */
import { Hotkey } from '../../node_modules/@gravity-ui/uikit/build/esm/components/Hotkey/Hotkey.mjs';
import { TextInput } from '../../node_modules/@gravity-ui/uikit/build/esm/components/controls/TextInput/TextInput.mjs';
import { List } from '../../node_modules/@gravity-ui/uikit/build/esm/components/List/List.mjs';

const b = block("hotkeys-panel");
function HotkeysPanel({
  visible,
  onClose,
  leftOffset,
  topOffset,
  className,
  preventScrollBody,
  hotkeys,
  itemClassName,
  filterPlaceholder,
  title,
  emptyState,
  ...listProps
}) {
  const [filter, setFilter] = reactExports.useState("");
  const hotkeysList = reactExports.useMemo(() => {
    const filteredHotkeys = filterHotkeys(hotkeys, filter);
    return flattenHotkeyGroups(filteredHotkeys);
  }, [hotkeys, filter]);
  const renderItem = reactExports.useCallback(
    (item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b("item-content", { group: item.group }), children: [
      item.title,
      item.value && /* @__PURE__ */ jsxRuntimeExports.jsx(Hotkey, { className: b("hotkey"), value: item.value })
    ] }, item.title),
    []
  );
  const drawerItemContent = /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: b("title"), children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TextInput,
      {
        value: filter,
        onUpdate: setFilter,
        placeholder: filterPlaceholder,
        autoFocus: true,
        className: b("search"),
        hasClear: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      List,
      {
        className: b("list"),
        virtualized: false,
        filterable: false,
        items: hotkeysList,
        renderItem,
        itemClassName: b("item", itemClassName),
        emptyPlaceholder: emptyState,
        ...listProps
      }
    )
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Drawer,
    {
      className: b(null, className),
      onVeilClick: onClose,
      onEscape: onClose,
      preventScrollBody,
      style: {
        left: leftOffset,
        top: topOffset
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        DrawerItem,
        {
          id: "hotkeys",
          visible,
          className: b("drawer-item"),
          content: drawerItemContent
        }
      )
    }
  );
}

export { HotkeysPanel };
//# sourceMappingURL=HotkeysPanel.mjs.map
