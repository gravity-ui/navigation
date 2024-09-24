import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import React from '../../../node_modules/react/index.mjs';
import { block } from '../../utils/cn.mjs';
import { COLLAPSE_ITEM_ID } from '../constants.mjs';
import { MultipleTooltipContext } from './MultipleTooltipContext.mjs';
/* empty css                      */
import { Popup } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/Popup/Popup.mjs';

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
  const { activeIndex, hideCollapseItemTooltip } = React.useContext(MultipleTooltipContext);
  const activeItem = activeIndex === void 0 ? null : items[activeIndex];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Popup,
    {
      open,
      anchorRef,
      placement,
      offset: POPUP_OFFSET,
      contentClassName: b(null),
      modifiers: POPUP_MODIFIERS,
      disableLayer: true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("items-container"), children: items.filter(
        ({ type = "regular", id }) => !hideCollapseItemTooltip || id !== COLLAPSE_ITEM_ID && type !== "action"
      ).map((item, idx) => {
        switch (item.type) {
          case "divider":
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("item", { divider: true }), children: item.title }, idx);
          default:
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
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
//# sourceMappingURL=MultipleTooltip.mjs.map
