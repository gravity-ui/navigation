'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../node_modules/react/index.cjs');
const cn = require('../../utils/cn.cjs');
const MenuItem = require('../MenuItem/MenuItem.cjs');
const moreItemsPopupProps = require('./constants/moreItemsPopupProps.cjs');
;/* empty css              */
const useOverflowingHorizontalListItems = require('../../../hooks/useOverflowingHorizontalListItems/useOverflowingHorizontalListItems.cjs');
const Menu = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Menu/Menu.cjs');
const DropdownMenu = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/DropdownMenu/DropdownMenu.cjs');
const Logo = require('../../Logo/Logo.cjs');

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
  const menuContainerRef = index.reactExports.useRef(null);
  const menuItems = view === "clear" ? void 0 : providedMenuItems;
  const { visibleItems, hiddenItems, measured } = useOverflowingHorizontalListItems.useOverflowingHorizontalListItems({
    containerRef: menuContainerRef,
    items: menuItems,
    itemSelector: `.${b("menu-item")}`,
    moreButtonWidth: 28
  });
  const moreButtonProps = index.reactExports.useMemo(
    () => ({
      title: moreButtonTitle
    }),
    [moreButtonTitle]
  );
  const dropdownMenuItems = index.reactExports.useMemo(
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
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("footer", { className: b({ desktop: true, "with-divider": withDivider, view }, className), children: [
    shouldRenderMenu && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b("menu", { measured }), ref: menuContainerRef, children: [
      visibleItems.length > 0 && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Menu.Menu, { className: b("list"), children: visibleItems.map((item, index) => /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
        MenuItem.MenuItem,
        {
          ...item,
          className: b("menu-item", item.className)
        },
        index
      )) }),
      dropdownMenuItems.length > 0 && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
        DropdownMenu.DropdownMenu,
        {
          items: dropdownMenuItems,
          switcherWrapperClassName: b("more-button"),
          popupProps: moreItemsPopupProps.moreItemsPopupProps,
          defaultSwitcherProps: moreButtonProps,
          onSwitcherClick: onMoreButtonClick
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b("right"), children: [
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("small", { className: b("copyright", { small: !menuItems?.length }), children: copyright }),
      shouldRenderLogo && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: logoWrapperClassName, children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Logo.Logo, { ...logo }) })
    ] })
  ] });
};

exports.Footer = Footer;
//# sourceMappingURL=Footer.cjs.map
