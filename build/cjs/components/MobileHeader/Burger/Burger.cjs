'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const React = require('react');
const cn = require('../../utils/cn.cjs');
;/* empty css              */

const b = cn.block("mobile-header-burger");
const Burger = React.memo(
  ({ closeTitle, openTitle, opened, className, onClick }) => /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
    "button",
    {
      className: b({ opened }, className),
      onClick,
      "aria-label": opened ? closeTitle : openTitle,
      children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("span", { className: b("icon"), children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("span", { className: b("icon-dash") }) })
    }
  )
);
Burger.displayName = "Burger";

exports.Burger = Burger;
//# sourceMappingURL=Burger.cjs.map
