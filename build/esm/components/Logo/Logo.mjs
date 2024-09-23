import { jsx, jsxs } from 'react/jsx-runtime';
import { Button, Icon } from '@gravity-ui/uikit';
import { block } from '../utils/cn.mjs';
/* empty css           */

const b = block("logo");
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
    buttonIcon = /* @__PURE__ */ jsx(Button.Icon, { className: iconClassName, children: /* @__PURE__ */ jsx("img", { alt: "logo icon", src: iconSrc, width: iconSize, height: iconSize }) });
  } else if (icon) {
    buttonIcon = /* @__PURE__ */ jsx(Icon, { data: icon, size: iconSize, className: iconClassName });
  }
  const button = /* @__PURE__ */ jsx(
    Button,
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
    logo = /* @__PURE__ */ jsx("div", { className: b("logo"), style: { fontSize: textSize }, children: text });
  }
  return /* @__PURE__ */ jsxs("div", { className: b(null, className), children: [
    /* @__PURE__ */ jsx("div", { className: b("logo-btn-place", buttonWrapperClassName), children: hasWrapper ? wrapper(button, Boolean(compact)) : button }),
    !compact && (hasWrapper ? /* @__PURE__ */ jsx("div", { onClick, children: wrapper(logo, Boolean(compact)) }) : /* @__PURE__ */ jsx(
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

export { Logo };
//# sourceMappingURL=Logo.mjs.map
