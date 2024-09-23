import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef, useMemo } from 'react';
import { Menu, DropdownMenu } from '@gravity-ui/uikit';
import { block } from '../../utils/cn.mjs';
import { MenuItem } from '../MenuItem/MenuItem.mjs';
import { moreItemsPopupProps } from './constants/moreItemsPopupProps.mjs';
/* empty css             */
import { useOverflowingHorizontalListItems } from '../../../hooks/useOverflowingHorizontalListItems/useOverflowingHorizontalListItems.mjs';
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
  const menuContainerRef = useRef(null);
  const menuItems = view === "clear" ? void 0 : providedMenuItems;
  const { visibleItems, hiddenItems, measured } = useOverflowingHorizontalListItems({
    containerRef: menuContainerRef,
    items: menuItems,
    itemSelector: `.${b("menu-item")}`,
    moreButtonWidth: 28
  });
  const moreButtonProps = useMemo(
    () => ({
      title: moreButtonTitle
    }),
    [moreButtonTitle]
  );
  const dropdownMenuItems = useMemo(
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
  return /* @__PURE__ */ jsxs("footer", { className: b({ desktop: true, "with-divider": withDivider, view }, className), children: [
    shouldRenderMenu && /* @__PURE__ */ jsxs("div", { className: b("menu", { measured }), ref: menuContainerRef, children: [
      visibleItems.length > 0 && /* @__PURE__ */ jsx(Menu, { className: b("list"), children: visibleItems.map((item, index) => /* @__PURE__ */ jsx(
        MenuItem,
        {
          ...item,
          className: b("menu-item", item.className)
        },
        index
      )) }),
      dropdownMenuItems.length > 0 && /* @__PURE__ */ jsx(
        DropdownMenu,
        {
          items: dropdownMenuItems,
          switcherWrapperClassName: b("more-button"),
          popupProps: moreItemsPopupProps,
          defaultSwitcherProps: moreButtonProps,
          onSwitcherClick: onMoreButtonClick
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: b("right"), children: [
      /* @__PURE__ */ jsx("small", { className: b("copyright", { small: !menuItems?.length }), children: copyright }),
      shouldRenderLogo && /* @__PURE__ */ jsx("div", { className: logoWrapperClassName, children: /* @__PURE__ */ jsx(Logo, { ...logo }) })
    ] })
  ] });
};

export { Footer };
//# sourceMappingURL=Footer.mjs.map
