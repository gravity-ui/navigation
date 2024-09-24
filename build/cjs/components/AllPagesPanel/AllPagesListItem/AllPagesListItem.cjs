'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../node_modules/react/index.cjs');
const cn = require('../../utils/cn.cjs');
;/* empty css                        */
const Pin = require('../../../node_modules/@gravity-ui/icons/esm/Pin.cjs');
const PinFill = require('../../../node_modules/@gravity-ui/icons/esm/PinFill.cjs');
const Icon = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.cjs');
const Button = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Button/Button.cjs');

const b = cn.block("all-pages-list-item");
const AllPagesListItem = (props) => {
  const { item, editMode, onToggle } = props;
  const onPinButtonClick = index.reactExports.useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onToggle();
    },
    [onToggle]
  );
  const onItemClick = (e) => {
    if (editMode) {
      e.stopPropagation();
      e.preventDefault();
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b(), onClick: onItemClick, children: [
    item.icon ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Icon.Icon, { className: b("icon"), data: item.icon, size: item.iconSize }) : null,
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("span", { className: b("text"), children: item.title }),
    editMode && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
      Button.Button,
      {
        onClick: onPinButtonClick,
        view: item.hidden ? "flat-secondary" : "flat-action",
        children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Button.Button.Icon, { children: item.hidden ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Pin.default, {}) : /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(PinFill.default, {}) })
      }
    )
  ] });
};

exports.AllPagesListItem = AllPagesListItem;
//# sourceMappingURL=AllPagesListItem.cjs.map
