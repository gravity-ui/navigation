'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../node_modules/react/jsx-runtime.cjs');
const icons = require('@gravity-ui/icons');
const uikit = require('@gravity-ui/uikit');
const cn = require('../utils/cn.cjs');
const index = require('./i18n/index.cjs');
;/* empty css             */

const b = cn.block("title");
const Title = ({
  children,
  closeIconSize = 23,
  hasSeparator,
  closeTitle = index.default("button_close"),
  onClose
}) => {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b({ separator: hasSeparator }), children: [
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(uikit.Text, { className: b("text"), as: "h3", variant: "subheader-3", children }),
    onClose && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
      uikit.Button,
      {
        onClick: onClose,
        view: "flat",
        size: "l",
        extraProps: {
          "aria-label": closeTitle
        },
        children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(uikit.Icon, { data: icons.Xmark, size: closeIconSize })
      }
    )
  ] });
};
Title.displayName = "Title";

exports.Title = Title;
//# sourceMappingURL=Title.cjs.map
