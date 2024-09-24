'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../node_modules/react/index.cjs');
const cn = require('../../utils/cn.cjs');
const MenuItem = require('../MenuItem/MenuItem.cjs');
;/* empty css              */
const Ellipsis = require('../../../node_modules/@gravity-ui/icons/esm/Ellipsis.cjs');
const useOverflowingHorizontalListItems = require('../../../hooks/useOverflowingHorizontalListItems/useOverflowingHorizontalListItems.cjs');
const Button = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Button/Button.cjs');
const Icon = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.cjs');
const Sheet = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Sheet/Sheet.cjs');
const Logo = require('../../Logo/Logo.cjs');
const Menu = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Menu/Menu.cjs');

const b = cn.block("footer");
const modalId = "footer-more-items";
const MobileFooter = ({
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
  const [moreItemsMenuVisible, setMoreItemsMenuVisible] = index.reactExports.useState(false);
  const menuContainerRef = index.reactExports.useRef(null);
  const handleOpenMoreItemsMenu = index.reactExports.useCallback(
    (event) => {
      setMoreItemsMenuVisible(true);
      onMoreButtonClick?.(event);
    },
    [onMoreButtonClick]
  );
  const handleCloseMoreItemsMenu = index.reactExports.useCallback(() => {
    setMoreItemsMenuVisible(false);
  }, []);
  const menuItems = view === "clear" ? void 0 : providedMenuItems;
  const { visibleItems, hiddenItems, measured } = useOverflowingHorizontalListItems.useOverflowingHorizontalListItems({
    containerRef: menuContainerRef,
    items: menuItems,
    itemSelector: `.${b("menu-item")}`,
    moreButtonWidth: 28
  });
  const renderMenu = (items) => /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Menu.Menu, { className: b("list"), children: items.map((item, index) => /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(MenuItem.MenuItem, { ...item, className: b("menu-item", item.className) }, index)) });
  const shouldRenderLogo = view !== "clear" && Boolean(logo);
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("footer", { className: b({ mobile: true, "with-divider": withDivider, view }, className), children: [
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b("menu", { measured }), ref: menuContainerRef, children: [
      visibleItems.length > 0 && renderMenu(visibleItems),
      hiddenItems.length > 0 && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(jsxRuntime.jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
          Button.Button,
          {
            view: "flat-secondary",
            size: "l",
            onClick: handleOpenMoreItemsMenu,
            title: moreButtonTitle,
            children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Icon.Icon, { data: Ellipsis.default, size: 16 })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
          Sheet.Sheet,
          {
            id: modalId,
            visible: moreItemsMenuVisible,
            className: b("modal"),
            contentClassName: b("modal-content"),
            onClose: handleCloseMoreItemsMenu,
            children: renderMenu(hiddenItems)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b("bottom-row"), children: [
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("small", { className: b("copyright"), children: copyright }),
      shouldRenderLogo && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: logoWrapperClassName, children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Logo.Logo, { ...logo }) })
    ] })
  ] });
};

exports.MobileFooter = MobileFooter;
//# sourceMappingURL=Footer.cjs.map
