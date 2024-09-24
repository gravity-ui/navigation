import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import React from '../../../node_modules/react/index.mjs';
import { block } from '../../utils/cn.mjs';
/* empty css             */

const b = block("mobile-header-burger");
const Burger = React.memo(
  ({ closeTitle, openTitle, opened, className, onClick }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: b({ opened }, className),
      onClick,
      "aria-label": opened ? closeTitle : openTitle,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: b("icon"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: b("icon-dash") }) })
    }
  )
);
Burger.displayName = "Burger";

export { Burger };
//# sourceMappingURL=Burger.mjs.map
