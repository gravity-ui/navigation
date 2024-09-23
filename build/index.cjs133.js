'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const cn = require('./index.cjs24.js');
const constants = require('./index.cjs39.js');
const MultipleTooltipContext = require('./index.cjs132.js');
;/* empty css              */

const b = cn.block("multiple-tooltip");
const POPUP_OFFSET = [-32, 4];
const POPUP_MODIFIERS = [
  {
    name: "preventOverflow",
    enabled: false
  }
];
const MultipleTooltip = ({
  items,
  open,
  anchorRef,
  placement
}) => {
  const { activeIndex, hideCollapseItemTooltip } = React.useContext(MultipleTooltipContext.MultipleTooltipContext);
  const activeItem = activeIndex === void 0 ? null : items[activeIndex];
  return /* @__PURE__ */ jsxRuntime.jsx(
    uikit.Popup,
    {
      open,
      anchorRef,
      placement,
      offset: POPUP_OFFSET,
      contentClassName: b(null),
      modifiers: POPUP_MODIFIERS,
      disableLayer: true,
      children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("items-container"), children: items.filter(
        ({ type = "regular", id }) => !hideCollapseItemTooltip || id !== constants.COLLAPSE_ITEM_ID && type !== "action"
      ).map((item, idx) => {
        switch (item.type) {
          case "divider":
            return /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("item", { divider: true }), children: item.title }, idx);
          default:
            return /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: b("item", {
                  active: item === activeItem
                }),
                children: item.title
              },
              idx
            );
        }
      }) })
    }
  );
};

exports.MultipleTooltip = MultipleTooltip;
//# sourceMappingURL=index.cjs133.js.map
