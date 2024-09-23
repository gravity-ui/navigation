'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const Drawer = require('./index.cjs8.js');
const cn = require('./index.cjs24.js');
const filterHotkeys = require('./index.cjs56.js');
const flattenHotkeyGroups = require('./index.cjs57.js');
;/* empty css             */

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
  const [filter, setFilter] = React.useState("");
  const hotkeysList = React.useMemo(() => {
    const filteredHotkeys = filterHotkeys.filterHotkeys(hotkeys, filter);
    return flattenHotkeyGroups.flattenHotkeyGroups(filteredHotkeys);
  }, [hotkeys, filter]);
  const renderItem = React.useCallback(
    (item) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: b("item-content", { group: item.group }), children: [
      item.title,
      item.value && /* @__PURE__ */ jsxRuntime.jsx(uikit.Hotkey, { className: b("hotkey"), value: item.value })
    ] }, item.title),
    []
  );
  const drawerItemContent = /* @__PURE__ */ jsxRuntime.jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h2", { className: b("title"), children: title }),
    /* @__PURE__ */ jsxRuntime.jsx(
      uikit.TextInput,
      {
        value: filter,
        onUpdate: setFilter,
        placeholder: filterPlaceholder,
        autoFocus: true,
        className: b("search"),
        hasClear: true
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      uikit.List,
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
      children: /* @__PURE__ */ jsxRuntime.jsx(
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
//# sourceMappingURL=index.cjs11.js.map
