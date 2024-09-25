'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const cn = require('../utils/cn.cjs');
;/* empty css                  */

const b = cn.block("mobile-logo");
const MobileLogo = ({
  text,
  compact,
  icon,
  iconSrc,
  iconClassName,
  iconSize = 32,
  textSize = 20,
  href = "/",
  target = "_self",
  wrapper,
  onClick,
  className
}) => {
  const hasWrapper = typeof wrapper === "function";
  let logoIcon;
  if (iconSrc) {
    logoIcon = /* @__PURE__ */ jsxRuntime.jsx(
      "img",
      {
        alt: "logo icon",
        src: iconSrc,
        width: iconSize,
        height: iconSize,
        className: iconClassName
      }
    );
  } else if (icon) {
    logoIcon = /* @__PURE__ */ jsxRuntime.jsx(uikit.Icon, { data: icon, size: iconSize, className: b("icon", iconClassName) });
  }
  let logoTitle;
  if (typeof text === "function") {
    logoTitle = text();
  } else {
    logoTitle = /* @__PURE__ */ jsxRuntime.jsx("span", { className: b("title"), style: { fontSize: textSize }, children: text });
  }
  const logo = /* @__PURE__ */ jsxRuntime.jsxs(React.Fragment, { children: [
    logoIcon,
    logoTitle
  ] });
  return hasWrapper ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: b(null, className), onClick, children: wrapper(logo, compact) }) : /* @__PURE__ */ jsxRuntime.jsx(
    "a",
    {
      href,
      target,
      ref: target === "_self" ? void 0 : "noreferrer",
      className: b(null, className),
      onClick,
      children: logo
    }
  );
};

exports.MobileLogo = MobileLogo;
//# sourceMappingURL=MobileLogo.cjs.map
