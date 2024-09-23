'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const uikit = require('@gravity-ui/uikit');
const cn = require('./index.cjs24.js');
;/* empty css             */

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
    buttonIcon = /* @__PURE__ */ jsxRuntime.jsx(uikit.Button.Icon, { className: iconClassName, children: /* @__PURE__ */ jsxRuntime.jsx("img", { alt: "logo icon", src: iconSrc, width: iconSize, height: iconSize }) });
  } else if (icon) {
    buttonIcon = /* @__PURE__ */ jsxRuntime.jsx(uikit.Icon, { data: icon, size: iconSize, className: iconClassName });
  }
  const button = /* @__PURE__ */ jsxRuntime.jsx(
    uikit.Button,
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
    logo = /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("logo"), style: { fontSize: textSize }, children: text });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: b(null, className), children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("logo-btn-place", buttonWrapperClassName), children: hasWrapper ? wrapper(button, Boolean(compact)) : button }),
    !compact && (hasWrapper ? /* @__PURE__ */ jsxRuntime.jsx("div", { onClick, children: wrapper(logo, Boolean(compact)) }) : /* @__PURE__ */ jsxRuntime.jsx(
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
//# sourceMappingURL=index.cjs18.js.map
