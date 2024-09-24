'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../node_modules/react/jsx-runtime.cjs');
const cn = require('../utils/cn.cjs');
const index = require('./i18n/index.cjs');
;/* empty css             */
const Xmark = require('../../node_modules/@gravity-ui/icons/esm/Xmark.cjs');
const Text = require('../../node_modules/@gravity-ui/uikit/build/esm/components/Text/Text.cjs');
const Button = require('../../node_modules/@gravity-ui/uikit/build/esm/components/Button/Button.cjs');
const Icon = require('../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.cjs');

const b = cn.block("title");
const Title = ({
  children,
  closeIconSize = 23,
  hasSeparator,
  closeTitle = index.default("button_close"),
  onClose
}) => {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b({ separator: hasSeparator }), children: [
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Text.Text, { className: b("text"), as: "h3", variant: "subheader-3", children }),
    onClose && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
      Button.Button,
      {
        onClick: onClose,
        view: "flat",
        size: "l",
        extraProps: {
          "aria-label": closeTitle
        },
        children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Icon.Icon, { data: Xmark.default, size: closeIconSize })
      }
    )
  ] });
};
Title.displayName = "Title";

exports.Title = Title;
//# sourceMappingURL=Title.cjs.map
