'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../node_modules/react/jsx-runtime.cjs');
const cn = require('../utils/cn.cjs');
;/* empty css            */
const Button = require('../../node_modules/@gravity-ui/uikit/build/esm/components/Button/Button.cjs');
const Icon = require('../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.cjs');

const b = cn.block("logo");
const Logo = ({
  text,
  icon,
  iconSrc,
  iconClassName,
  iconSize = 24,
  textSize = 15,
  href,
  target = "_self",
  wrapper,
  onClick,
  compact,
  className,
  buttonWrapperClassName,
  buttonClassName,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby
}) => {
  const hasWrapper = typeof wrapper === "function";
  let buttonIcon;
  if (iconSrc) {
    buttonIcon = /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Button.Button.Icon, { className: iconClassName, children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("img", { alt: "logo icon", src: iconSrc, width: iconSize, height: iconSize }) });
  } else if (icon) {
    buttonIcon = /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Icon.Icon, { data: icon, size: iconSize, className: iconClassName });
  }
  const button = /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
    Button.Button,
    {
      view: "flat",
      size: "l",
      className: b("btn-logo", buttonClassName),
      component: hasWrapper ? "span" : void 0,
      onClick,
      target,
      rel: target === "_self" ? void 0 : "noreferrer",
      href,
      extraProps: {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby
      },
      children: buttonIcon
    }
  );
  let logo;
  if (typeof text === "function") {
    logo = text();
  } else {
    logo = /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("logo"), style: { fontSize: textSize }, children: text });
  }
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b(null, className), children: [
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("logo-btn-place", buttonWrapperClassName), children: hasWrapper ? wrapper(button, Boolean(compact)) : button }),
    !compact && (hasWrapper ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { onClick, children: wrapper(logo, Boolean(compact)) }) : /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
      "a",
      {
        href: href ?? "/",
        target,
        rel: target === "_self" ? void 0 : "noreferrer",
        className: b("logo-link"),
        onClick,
        children: logo
      }
    ))
  ] });
};

exports.Logo = Logo;
//# sourceMappingURL=Logo.cjs.map
