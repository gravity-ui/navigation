import { jsxs, jsx } from 'react/jsx-runtime';
import React__default, { useState, useMemo, useCallback } from 'react';
import { Hotkey, TextInput, List } from '@gravity-ui/uikit';
import { Drawer, DrawerItem } from './index.es8.js';
import { block } from './index.es24.js';
import { filterHotkeys } from './index.es56.js';
import { flattenHotkeyGroups } from './index.es57.js';
/* empty css           */

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
  const [filter, setFilter] = useState("");
  const hotkeysList = useMemo(() => {
    const filteredHotkeys = filterHotkeys(hotkeys, filter);
    return flattenHotkeyGroups(filteredHotkeys);
  }, [hotkeys, filter]);
  const renderItem = useCallback(
    (item) => /* @__PURE__ */ jsxs("div", { className: b("item-content", { group: item.group }), children: [
      item.title,
      item.value && /* @__PURE__ */ jsx(Hotkey, { className: b("hotkey"), value: item.value })
    ] }, item.title),
    []
  );
  const drawerItemContent = /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
    /* @__PURE__ */ jsx("h2", { className: b("title"), children: title }),
    /* @__PURE__ */ jsx(
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
    /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsx(
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
      children: /* @__PURE__ */ jsx(
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
//# sourceMappingURL=index.es11.js.map
