import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import { r as reactExports } from '../../../node_modules/react/index.mjs';
import { block } from '../../utils/cn.mjs';
import { MenuItem } from '../MenuItem/MenuItem.mjs';
import { moreItemsPopupProps } from './constants/moreItemsPopupProps.mjs';
/* empty css             */
import { useOverflowingHorizontalListItems } from '../../../hooks/useOverflowingHorizontalListItems/useOverflowingHorizontalListItems.mjs';
import { Menu } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/Menu/Menu.mjs';
import { DropdownMenu as DropdownMenuExport } from '../../../node_modules/@gravity-ui/uikit/build/esm/components/DropdownMenu/DropdownMenu.mjs';
import { Logo } from '../../Logo/Logo.mjs';

const b = block("footer");
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
  const menuContainerRef = reactExports.useRef(null);
  const menuItems = view === "clear" ? void 0 : providedMenuItems;
  const { visibleItems, hiddenItems, measured } = useOverflowingHorizontalListItems({
    containerRef: menuContainerRef,
    items: menuItems,
    itemSelector: `.${b("menu-item")}`,
    moreButtonWidth: 28
  });
  const moreButtonProps = reactExports.useMemo(
    () => ({
      title: moreButtonTitle
    }),
    [moreButtonTitle]
  );
  const dropdownMenuItems = reactExports.useMemo(
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: b({ desktop: true, "with-divider": withDivider, view }, className), children: [
    shouldRenderMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b("menu", { measured }), ref: menuContainerRef, children: [
      visibleItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: b("list"), children: visibleItems.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          ...item,
          className: b("menu-item", item.className)
        },
        index
      )) }),
      dropdownMenuItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        DropdownMenuExport,
        {
          items: dropdownMenuItems,
          switcherWrapperClassName: b("more-button"),
          popupProps: moreItemsPopupProps,
          defaultSwitcherProps: moreButtonProps,
          onSwitcherClick: onMoreButtonClick
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b("right"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: b("copyright", { small: !menuItems?.length }), children: copyright }),
      shouldRenderLogo && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: logoWrapperClassName, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { ...logo }) })
    ] })
  ] });
};

export { Footer };
//# sourceMappingURL=Footer.mjs.map
