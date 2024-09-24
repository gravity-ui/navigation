import { j as jsxRuntimeExports } from '../../node_modules/react/jsx-runtime.mjs';
import React__default, { useState, useCallback, useMemo, useEffect, createElement } from 'react';
import { useForwardRef } from '../../hooks/useForwardRef.mjs';
import { Drawer, DrawerItem } from '../Drawer/Drawer.mjs';
import { block } from '../utils/cn.mjs';
import { Burger } from './Burger/Burger.mjs';
import { BurgerMenu } from './BurgerMenu/BurgerMenu.mjs';
import { MOBILE_HEADER_EVENT_NAMES, BURGER_PANEL_ITEM_ID, MOBILE_HEADER_COMPACT_HEIGHT, MOBILE_HEADER_EXPANDED_HEIGHT } from './constants.mjs';
import i18n from './i18n/index.mjs';
/* empty css                   */
import { MobileLogo } from '../MobileLogo/MobileLogo.mjs';
import { Content } from '../Content/Content.mjs';

const b = block("mobile-header");
const MobileHeader = React__default.forwardRef(
  ({
    logo,
    burgerMenu,
    burgerCloseTitle = i18n("burger_button_close"),
    burgerOpenTitle = i18n("burger_button_open"),
    panelItems = [],
    renderContent,
    sideItemRenderContent,
    onClosePanel,
    onEvent,
    className,
    contentClassName
  }, ref) => {
    const targetRef = useForwardRef(ref);
    const [compact] = useState(true);
    const [visiblePanel, setVisiblePanel] = useState(null);
    const size = compact ? MOBILE_HEADER_COMPACT_HEIGHT : MOBILE_HEADER_EXPANDED_HEIGHT;
    const onPanelToggle = useCallback(
      (name) => {
        if (!name) return;
        setVisiblePanel((prev) => {
          const panelOpen = prev === name;
          onEvent?.(
            name,
            panelOpen ? MOBILE_HEADER_EVENT_NAMES.closeEvent : MOBILE_HEADER_EVENT_NAMES.openEvent
          );
          return panelOpen ? null : name;
        });
      },
      [onEvent]
    );
    const onMobilePanelToggle = useCallback(
      ({ detail }) => {
        if (typeof detail?.panelName === "string") {
          onPanelToggle(detail?.panelName);
        }
      },
      [onPanelToggle]
    );
    const onMobilePanelOpen = useCallback(
      ({ detail }) => {
        if (typeof detail?.panelName === "string") {
          onEvent?.(detail?.panelName, MOBILE_HEADER_EVENT_NAMES.openEvent);
          setVisiblePanel(detail?.panelName);
        }
      },
      [onEvent]
    );
    const onMobilePanelClose = useCallback(
      ({ detail }) => {
        if (typeof detail?.panelName === "string") {
          onEvent?.(detail?.panelName, MOBILE_HEADER_EVENT_NAMES.closeEvent);
          setVisiblePanel(null);
        }
      },
      [onEvent]
    );
    const onBurgerOpen = useCallback(() => {
      onEvent?.(BURGER_PANEL_ITEM_ID, MOBILE_HEADER_EVENT_NAMES.openEvent);
      setVisiblePanel(BURGER_PANEL_ITEM_ID);
    }, [onEvent]);
    const onBurgerClose = useCallback(() => {
      onEvent?.(BURGER_PANEL_ITEM_ID, MOBILE_HEADER_EVENT_NAMES.closeEvent);
      setVisiblePanel(null);
    }, [onEvent]);
    const onCloseDrawer = useCallback(() => {
      if (visiblePanel) {
        onEvent?.(visiblePanel, MOBILE_HEADER_EVENT_NAMES.closeEvent);
      }
      setVisiblePanel(null);
    }, [visiblePanel, onEvent]);
    const onBurgerMenuItemClick = useCallback(
      (item) => {
        const closeMenuOnClick = item.closeMenuOnClick ?? true;
        if (closeMenuOnClick) {
          onBurgerClose();
        }
      },
      [onBurgerClose]
    );
    const renderBurgerMenuFooter = useCallback(
      () => burgerMenu.renderFooter?.({
        size,
        isCompact: compact
      }),
      [burgerMenu, size, compact]
    );
    const onLogoClick = useCallback(
      (event) => {
        onClosePanel?.();
        logo.onClick?.(event);
      },
      [logo, onClosePanel]
    );
    const burgerPanelItem = useMemo(
      () => ({
        id: BURGER_PANEL_ITEM_ID,
        content: /* @__PURE__ */ jsxRuntimeExports.jsx(
          BurgerMenu,
          {
            items: burgerMenu.items,
            modalItem: burgerMenu.modalItem,
            renderFooter: renderBurgerMenuFooter,
            onItemClick: onBurgerMenuItemClick,
            className: b("burger-menu")
          }
        )
      }),
      [burgerMenu.items, burgerMenu.modalItem, onBurgerMenuItemClick, renderBurgerMenuFooter]
    );
    useEffect(() => {
      const node = targetRef?.current;
      if (node) {
        node.addEventListener("MOBILE_BURGER_OPEN", onBurgerOpen);
        node.addEventListener("MOBILE_BURGER_CLOSE", onBurgerClose);
        node.addEventListener(
          "MOBILE_PANEL_TOGGLE",
          onMobilePanelToggle
        );
        node.addEventListener(
          "MOBILE_PANEL_OPEN",
          onMobilePanelOpen
        );
        node.addEventListener(
          "MOBILE_PANEL_CLOSE",
          onMobilePanelClose
        );
      }
      return () => {
        if (node) {
          node.removeEventListener("MOBILE_BURGER_OPEN", onBurgerOpen);
          node.removeEventListener("MOBILE_BURGER_CLOSE", onBurgerClose);
          node.removeEventListener(
            "MOBILE_PANEL_TOGGLE",
            onMobilePanelToggle
          );
          node.removeEventListener(
            "MOBILE_PANEL_OPEN",
            onMobilePanelOpen
          );
          node.removeEventListener(
            "MOBILE_PANEL_CLOSE",
            onMobilePanelClose
          );
        }
      };
    }, [
      targetRef,
      onBurgerClose,
      onBurgerOpen,
      onMobilePanelToggle,
      onMobilePanelOpen,
      onMobilePanelClose
    ]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b({ compact }, className), ref: targetRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: b("header"), style: { height: size }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Burger,
          {
            opened: visiblePanel === burgerPanelItem.id,
            onClick: () => onPanelToggle(BURGER_PANEL_ITEM_ID),
            className: b("burger"),
            closeTitle: burgerCloseTitle,
            openTitle: burgerOpenTitle
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MobileLogo, { ...logo, compact, onClick: onLogoClick }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("side-item"), children: sideItemRenderContent?.({ size }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Drawer,
        {
          className: b("panels"),
          onVeilClick: onCloseDrawer,
          onEscape: onCloseDrawer,
          style: { top: size },
          children: [burgerPanelItem, ...panelItems].map((item) => /* @__PURE__ */ createElement(
            DrawerItem,
            {
              ...item,
              key: item.id,
              visible: visiblePanel === item.id,
              className: b("panel-item", item.className)
            }
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Content,
        {
          size,
          renderContent,
          className: b("content", contentClassName),
          cssSizeVariableName: "--mobile-header-size"
        }
      )
    ] });
  }
);
MobileHeader.displayName = "MobileHeader";

export { MobileHeader };
//# sourceMappingURL=MobileHeader.mjs.map
