import { jsx, jsxs } from 'react/jsx-runtime';
import React__default from 'react';
import { Icon } from '@gravity-ui/uikit';
import { block } from './index.es24.js';
/* empty css           */

const b = block("mobile-logo");
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
    logoIcon = /* @__PURE__ */ jsx(
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
    logoIcon = /* @__PURE__ */ jsx(Icon, { data: icon, size: iconSize, className: b("icon", iconClassName) });
  }
  let logoTitle;
  if (typeof text === "function") {
    logoTitle = text();
  } else {
    logoTitle = /* @__PURE__ */ jsx("span", { className: b("title"), style: { fontSize: textSize }, children: text });
  }
  const logo = /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
    logoIcon,
    logoTitle
  ] });
  return hasWrapper ? /* @__PURE__ */ jsx("div", { className: b(null, className), onClick, children: wrapper(logo, compact) }) : /* @__PURE__ */ jsx(
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

export { MobileLogo };
//# sourceMappingURL=index.es19.js.map
