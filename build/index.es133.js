import { jsx } from 'react/jsx-runtime';
import React__default from 'react';
import { Popup } from '@gravity-ui/uikit';
import { block } from './index.es24.js';
import { COLLAPSE_ITEM_ID } from './index.es39.js';
import { MultipleTooltipContext } from './index.es132.js';
/* empty css            */

const b = block("multiple-tooltip");
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
  const { activeIndex, hideCollapseItemTooltip } = React__default.useContext(MultipleTooltipContext);
  const activeItem = activeIndex === void 0 ? null : items[activeIndex];
  return /* @__PURE__ */ jsx(
    Popup,
    {
      open,
      anchorRef,
      placement,
      offset: POPUP_OFFSET,
      contentClassName: b(null),
      modifiers: POPUP_MODIFIERS,
      disableLayer: true,
      children: /* @__PURE__ */ jsx("div", { className: b("items-container"), children: items.filter(
        ({ type = "regular", id }) => !hideCollapseItemTooltip || id !== COLLAPSE_ITEM_ID && type !== "action"
      ).map((item, idx) => {
        switch (item.type) {
          case "divider":
            return /* @__PURE__ */ jsx("div", { className: b("item", { divider: true }), children: item.title }, idx);
          default:
            return /* @__PURE__ */ jsx(
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

export { MultipleTooltip };
//# sourceMappingURL=index.es133.js.map
