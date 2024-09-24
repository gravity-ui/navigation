'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const React = require('react');
const icons = require('@gravity-ui/icons');
const uikit = require('@gravity-ui/uikit');
const cn = require('../../utils/cn.cjs');
;/* empty css                        */

const b = cn.block("all-pages-list-item");
const AllPagesListItem = (props) => {
  const { item, editMode, onToggle } = props;
  const onPinButtonClick = React.useCallback(
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
    item.icon ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(uikit.Icon, { className: b("icon"), data: item.icon, size: item.iconSize }) : null,
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("span", { className: b("text"), children: item.title }),
    editMode && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
      uikit.Button,
      {
        onClick: onPinButtonClick,
        view: item.hidden ? "flat-secondary" : "flat-action",
        children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(uikit.Button.Icon, { children: item.hidden ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(icons.Pin, {}) : /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(icons.PinFill, {}) })
      }
    )
  ] });
};

exports.AllPagesListItem = AllPagesListItem;
//# sourceMappingURL=AllPagesListItem.cjs.map
