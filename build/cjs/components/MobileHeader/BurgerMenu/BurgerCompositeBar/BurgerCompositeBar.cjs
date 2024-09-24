'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../../node_modules/react/jsx-runtime.cjs');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const cn = require('../../../utils/cn.cjs');
const constants = require('../../constants.cjs');
const utils = require('../../utils.cjs');
;/* empty css                          */

const b = cn.block("burger-composite-bar");
const Item = ({ item, onItemClick }) => {
  const { icon, type = "regular", iconSize = constants.MOBILE_HEADER_ICON_SIZE } = item;
  if (type === "divider") {
    return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("menu-divider") });
  }
  const node = /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(
    "div",
    {
      className: b("item", { type }),
      onClick: () => {
        if (typeof item.onItemClick === "function") {
          item.onItemClick(item);
        }
        if (type === "regular") {
          onItemClick?.(item);
        }
      },
      children: [
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("item-icon-place"), children: icon && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(uikit.Icon, { data: icon, size: iconSize, className: b("item-icon") }) }),
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("item-title"), children: item.title })
      ]
    }
  );
  if (typeof item.itemWrapper === "function") {
    return item.itemWrapper(node, item);
  }
  return item.link ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("a", { href: item.link, className: b("link"), children: node }) : node;
};
Item.displayName = "Item";
const BurgerCompositeBar = React.memo(({ items, onItemClick }) => {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("nav", { className: b(), children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
    uikit.List,
    {
      items,
      selectedItemIndex: utils.getSelectedItemIndex(items),
      itemHeight: utils.getItemHeight,
      itemClassName: b("root-menu-item"),
      virtualized: false,
      filterable: false,
      sortable: false,
      renderItem: (item) => /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Item, { item, onItemClick })
    }
  ) });
});
BurgerCompositeBar.displayName = "BurgerCompositeBar";

exports.BurgerCompositeBar = BurgerCompositeBar;
//# sourceMappingURL=BurgerCompositeBar.cjs.map
