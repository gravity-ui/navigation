'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const cn = require('./index.cjs24.js');
const MenuItem = require('./index.cjs88.js');
const moreItemsPopupProps = require('./index.cjs89.js');
;/* empty css             */
const useOverflowingHorizontalListItems = require('./index.cjs91.js');
const Logo = require('./index.cjs18.js');

const b = cn.block("footer");
const Footer = ({
  className,
  menuItems: providedMenuItems,
  withDivider,
  moreButtonTitle,
  onMoreButtonClick,
  view = "normal",
  logo,
  logoWrapperClassName,
  copyright
}) => {
  const menuContainerRef = React.useRef(null);
  const menuItems = view === "clear" ? void 0 : providedMenuItems;
  const { visibleItems, hiddenItems, measured } = useOverflowingHorizontalListItems.useOverflowingHorizontalListItems({
    containerRef: menuContainerRef,
    items: menuItems,
    itemSelector: `.${b("menu-item")}`,
    moreButtonWidth: 28
  });
  const moreButtonProps = React.useMemo(
    () => ({
      title: moreButtonTitle
    }),
    [moreButtonTitle]
  );
  const dropdownMenuItems = React.useMemo(
    () => hiddenItems.map(
      (item) => ({
        ...item,
        action: item.onClick
      })
    ),
    [hiddenItems]
  );
  const shouldRenderLogo = view !== "clear" && Boolean(logo);
  const shouldRenderMenu = (menuItems?.length ?? 0) > 0;
  return /* @__PURE__ */ jsxRuntime.jsxs("footer", { className: b({ desktop: true, "with-divider": withDivider, view }, className), children: [
    shouldRenderMenu && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: b("menu", { measured }), ref: menuContainerRef, children: [
      visibleItems.length > 0 && /* @__PURE__ */ jsxRuntime.jsx(uikit.Menu, { className: b("list"), children: visibleItems.map((item, index) => /* @__PURE__ */ jsxRuntime.jsx(
        MenuItem.MenuItem,
        {
          ...item,
          className: b("menu-item", item.className)
        },
        index
      )) }),
      dropdownMenuItems.length > 0 && /* @__PURE__ */ jsxRuntime.jsx(
        uikit.DropdownMenu,
        {
          items: dropdownMenuItems,
          switcherWrapperClassName: b("more-button"),
          popupProps: moreItemsPopupProps.moreItemsPopupProps,
          defaultSwitcherProps: moreButtonProps,
          onSwitcherClick: onMoreButtonClick
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: b("right"), children: [
      /* @__PURE__ */ jsxRuntime.jsx("small", { className: b("copyright", { small: !menuItems?.length }), children: copyright }),
      shouldRenderLogo && /* @__PURE__ */ jsxRuntime.jsx("div", { className: logoWrapperClassName, children: /* @__PURE__ */ jsxRuntime.jsx(Logo.Logo, { ...logo }) })
    ] })
  ] });
};

exports.Footer = Footer;
//# sourceMappingURL=index.cjs20.js.map
