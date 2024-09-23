import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useRef, useCallback } from 'react';
import { Ellipsis } from '@gravity-ui/icons';
import { Button, Icon, Sheet, Menu } from '@gravity-ui/uikit';
import { block } from './index.es24.js';
import { MenuItem } from './index.es88.js';
/* empty css           */
import { useOverflowingHorizontalListItems } from './index.es91.js';
import { Logo } from './index.es18.js';

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
  const [moreItemsMenuVisible, setMoreItemsMenuVisible] = useState(false);
  const menuContainerRef = useRef(null);
  const handleOpenMoreItemsMenu = useCallback(
    (event) => {
      setMoreItemsMenuVisible(true);
      onMoreButtonClick?.(event);
    },
    [onMoreButtonClick]
  );
  const handleCloseMoreItemsMenu = useCallback(() => {
    setMoreItemsMenuVisible(false);
  }, []);
  const menuItems = view === "clear" ? void 0 : providedMenuItems;
  const { visibleItems, hiddenItems, measured } = useOverflowingHorizontalListItems({
    containerRef: menuContainerRef,
    items: menuItems,
    itemSelector: `.${b("menu-item")}`,
    moreButtonWidth: 28
  });
  const renderMenu = (items) => /* @__PURE__ */ jsx(Menu, { className: b("list"), children: items.map((item, index) => /* @__PURE__ */ jsx(MenuItem, { ...item, className: b("menu-item", item.className) }, index)) });
  const shouldRenderLogo = view !== "clear" && Boolean(logo);
  return /* @__PURE__ */ jsxs("footer", { className: b({ mobile: true, "with-divider": withDivider, view }, className), children: [
    /* @__PURE__ */ jsxs("div", { className: b("menu", { measured }), ref: menuContainerRef, children: [
      visibleItems.length > 0 && renderMenu(visibleItems),
      hiddenItems.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            view: "flat-secondary",
            size: "l",
            onClick: handleOpenMoreItemsMenu,
            title: moreButtonTitle,
            children: /* @__PURE__ */ jsx(Icon, { data: Ellipsis, size: 16 })
          }
        ),
        /* @__PURE__ */ jsx(
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
    /* @__PURE__ */ jsxs("div", { className: b("bottom-row"), children: [
      /* @__PURE__ */ jsx("small", { className: b("copyright"), children: copyright }),
      shouldRenderLogo && /* @__PURE__ */ jsx("div", { className: logoWrapperClassName, children: /* @__PURE__ */ jsx(Logo, { ...logo }) })
    ] })
  ] });
};

export { MobileFooter };
//# sourceMappingURL=index.es21.js.map
