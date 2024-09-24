import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import { r as reactExports } from '../../../node_modules/react/index.mjs';
import { block } from '../../utils/cn.mjs';
import { MenuItem } from '../MenuItem/MenuItem.mjs';
/* empty css             */
import Ellipsis from '../../../node_modules/@gravity-ui/icons/esm/Ellipsis.mjs';
import { useOverflowingHorizontalListItems } from '../../../hooks/useOverflowingHorizontalListItems/useOverflowingHorizontalListItems.mjs';
import { Button } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/Button/Button.mjs';
import { Icon } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/Icon/Icon.mjs';
import { Sheet } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/Sheet/Sheet.mjs';
import { Logo } from '../../Logo/Logo.mjs';
import { Menu } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/Menu/Menu.mjs';

const b = block("footer");
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
  const [moreItemsMenuVisible, setMoreItemsMenuVisible] = reactExports.useState(false);
  const menuContainerRef = reactExports.useRef(null);
  const handleOpenMoreItemsMenu = reactExports.useCallback(
    (event) => {
      setMoreItemsMenuVisible(true);
      onMoreButtonClick?.(event);
    },
    [onMoreButtonClick]
  );
  const handleCloseMoreItemsMenu = reactExports.useCallback(() => {
    setMoreItemsMenuVisible(false);
  }, []);
  const menuItems = view === "clear" ? void 0 : providedMenuItems;
  const { visibleItems, hiddenItems, measured } = useOverflowingHorizontalListItems({
    containerRef: menuContainerRef,
    items: menuItems,
    itemSelector: `.${b("menu-item")}`,
    moreButtonWidth: 28
  });
  const renderMenu = (items) => /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: b("list"), children: items.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { ...item, className: b("menu-item", item.className) }, index)) });
  const shouldRenderLogo = view !== "clear" && Boolean(logo);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: b({ mobile: true, "with-divider": withDivider, view }, className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b("menu", { measured }), ref: menuContainerRef, children: [
      visibleItems.length > 0 && renderMenu(visibleItems),
      hiddenItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            view: "flat-secondary",
            size: "l",
            onClick: handleOpenMoreItemsMenu,
            title: moreButtonTitle,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { data: Ellipsis, size: 16 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Sheet,
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b("bottom-row"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: b("copyright"), children: copyright }),
      shouldRenderLogo && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: logoWrapperClassName, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { ...logo }) })
    ] })
  ] });
};

export { MobileFooter };
//# sourceMappingURL=Footer.mjs.map
