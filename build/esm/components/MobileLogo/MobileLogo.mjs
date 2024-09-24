import { j as jsxRuntimeExports } from '../../node_modules/react/jsx-runtime.mjs';
import React from '../../node_modules/react/index.mjs';
import { block } from '../utils/cn.mjs';
/* empty css                 */
import { Icon } from '../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.mjs';

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
    logoIcon = /* @__PURE__ */ jsxRuntimeExports.jsx(
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
    logoIcon = /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { data: icon, size: iconSize, className: b("icon", iconClassName) });
  }
  let logoTitle;
  if (typeof text === "function") {
    logoTitle = text();
  } else {
    logoTitle = /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: b("title"), style: { fontSize: textSize }, children: text });
  }
  const logo = /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
    logoIcon,
    logoTitle
  ] });
  return hasWrapper ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b(null, className), onClick, children: wrapper(logo, compact) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
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
//# sourceMappingURL=MobileLogo.mjs.map
