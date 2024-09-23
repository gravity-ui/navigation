'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const cn = require('./index.cjs24.js');
;/* empty css             */

const b = cn.block("mobile-header-burger");
const Burger = React.memo(
  ({ closeTitle, openTitle, opened, className, onClick }) => /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      className: b({ opened }, className),
      onClick,
      "aria-label": opened ? closeTitle : openTitle,
      children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: b("icon"), children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: b("icon-dash") }) })
    }
  )
);
Burger.displayName = "Burger";

exports.Burger = Burger;
//# sourceMappingURL=index.cjs50.js.map
