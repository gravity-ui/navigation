'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const icons = require('@gravity-ui/icons');
const uikit = require('@gravity-ui/uikit');
const cn = require('./index.cjs24.js');
const index = require('./index.cjs47.js');
;/* empty css             */

const b = cn.block("title");
const Title = ({
  children,
  closeIconSize = 23,
  hasSeparator,
  closeTitle = index.default("button_close"),
  onClose
}) => {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: b({ separator: hasSeparator }), children: [
    /* @__PURE__ */ jsxRuntime.jsx(uikit.Text, { className: b("text"), as: "h3", variant: "subheader-3", children }),
    onClose && /* @__PURE__ */ jsxRuntime.jsx(
      uikit.Button,
      {
        onClick: onClose,
        view: "flat",
        size: "l",
        extraProps: {
          "aria-label": closeTitle
        },
        children: /* @__PURE__ */ jsxRuntime.jsx(uikit.Icon, { data: icons.Xmark, size: closeIconSize })
      }
    )
  ] });
};
Title.displayName = "Title";

exports.Title = Title;
//# sourceMappingURL=index.cjs10.js.map
