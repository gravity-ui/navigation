'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../node_modules/react/jsx-runtime.cjs');
const index = require('../../node_modules/react/index.cjs');
const Drawer = require('../Drawer/Drawer.cjs');
const cn = require('../utils/cn.cjs');
const filterHotkeys = require('./utils/filterHotkeys.cjs');
const flattenHotkeyGroups = require('./utils/flattenHotkeyGroups.cjs');
;/* empty css                    */
const Hotkey = require('../../node_modules/@gravity-ui/uikit/build/esm/components/Hotkey/Hotkey.cjs');
const TextInput = require('../../node_modules/@gravity-ui/uikit/build/esm/components/controls/TextInput/TextInput.cjs');
const List = require('../../node_modules/@gravity-ui/uikit/build/esm/components/List/List.cjs');

const b = cn.block("hotkeys-panel");
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
  const [filter, setFilter] = index.reactExports.useState("");
  const hotkeysList = index.reactExports.useMemo(() => {
    const filteredHotkeys = filterHotkeys.filterHotkeys(hotkeys, filter);
    return flattenHotkeyGroups.flattenHotkeyGroups(filteredHotkeys);
  }, [hotkeys, filter]);
  const renderItem = index.reactExports.useCallback(
    (item) => /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b("item-content", { group: item.group }), children: [
      item.title,
      item.value && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Hotkey.Hotkey, { className: b("hotkey"), value: item.value })
    ] }, item.title),
    []
  );
  const drawerItemContent = /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(index.default.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("h2", { className: b("title"), children: title }),
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
      TextInput.TextInput,
      {
        value: filter,
        onUpdate: setFilter,
        placeholder: filterPlaceholder,
        autoFocus: true,
        className: b("search"),
        hasClear: true
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
      List.List,
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
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
    Drawer.Drawer,
    {
      className: b(null, className),
      onVeilClick: onClose,
      onEscape: onClose,
      preventScrollBody,
      style: {
        left: leftOffset,
        top: topOffset
      },
      children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
        Drawer.DrawerItem,
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

exports.HotkeysPanel = HotkeysPanel;
//# sourceMappingURL=HotkeysPanel.cjs.map
