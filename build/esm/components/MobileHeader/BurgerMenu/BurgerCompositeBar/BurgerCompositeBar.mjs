import { j as jsxRuntimeExports } from '../../../../node_modules/react/jsx-runtime.mjs';
import React from '../../../../node_modules/react/index.mjs';
import { block } from '../../../utils/cn.mjs';
import { MOBILE_HEADER_ICON_SIZE } from '../../constants.mjs';
import { getSelectedItemIndex, getItemHeight } from '../../utils.mjs';
/* empty css                         */
import { List } from '../../../../node_modules/@gravity-ui/uikit/build/esm/components/List/List.mjs';
import { Icon } from '../../../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.mjs';

const b = block("burger-composite-bar");
const Item = ({ item, onItemClick }) => {
  const { icon, type = "regular", iconSize = MOBILE_HEADER_ICON_SIZE } = item;
  if (type === "divider") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("menu-divider") });
  }
  const node = /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("item-icon-place"), children: icon && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { data: icon, size: iconSize, className: b("item-icon") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("item-title"), children: item.title })
      ]
    }
  );
  if (typeof item.itemWrapper === "function") {
    return item.itemWrapper(node, item);
  }
  return item.link ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: item.link, className: b("link"), children: node }) : node;
};
Item.displayName = "Item";
const BurgerCompositeBar = React.memo(({ items, onItemClick }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: b(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      items,
      selectedItemIndex: getSelectedItemIndex(items),
      itemHeight: getItemHeight,
      itemClassName: b("root-menu-item"),
      virtualized: false,
      filterable: false,
      sortable: false,
      renderItem: (item) => /* @__PURE__ */ jsxRuntimeExports.jsx(Item, { item, onItemClick })
    }
  ) });
});
BurgerCompositeBar.displayName = "BurgerCompositeBar";

export { BurgerCompositeBar };
//# sourceMappingURL=BurgerCompositeBar.mjs.map
