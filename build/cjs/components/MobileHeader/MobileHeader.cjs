'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../node_modules/react/jsx-runtime.cjs');
const index = require('../../node_modules/react/index.cjs');
const useForwardRef = require('../../hooks/useForwardRef.cjs');
const Drawer = require('../Drawer/Drawer.cjs');
const cn = require('../utils/cn.cjs');
const Burger = require('./Burger/Burger.cjs');
const BurgerMenu = require('./BurgerMenu/BurgerMenu.cjs');
const constants = require('./constants.cjs');
const index$1 = require('./i18n/index.cjs');
;/* empty css                    */
const MobileLogo = require('../MobileLogo/MobileLogo.cjs');
const Content = require('../Content/Content.cjs');

const b = cn.block("mobile-header");
const MobileHeader = index.default.forwardRef(
  ({
    logo,
    burgerMenu,
    burgerCloseTitle = index$1.default("burger_button_close"),
    burgerOpenTitle = index$1.default("burger_button_open"),
    panelItems = [],
    renderContent,
    sideItemRenderContent,
    onClosePanel,
    onEvent,
    className,
    contentClassName
  }, ref) => {
    const targetRef = useForwardRef.useForwardRef(ref);
    const [compact] = index.reactExports.useState(true);
    const [visiblePanel, setVisiblePanel] = index.reactExports.useState(null);
    const size = compact ? constants.MOBILE_HEADER_COMPACT_HEIGHT : constants.MOBILE_HEADER_EXPANDED_HEIGHT;
    const onPanelToggle = index.reactExports.useCallback(
      (name) => {
        if (!name) return;
        setVisiblePanel((prev) => {
          const panelOpen = prev === name;
          onEvent?.(
            name,
            panelOpen ? constants.MOBILE_HEADER_EVENT_NAMES.closeEvent : constants.MOBILE_HEADER_EVENT_NAMES.openEvent
          );
          return panelOpen ? null : name;
        });
      },
      [onEvent]
    );
    const onMobilePanelToggle = index.reactExports.useCallback(
      ({ detail }) => {
        if (typeof detail?.panelName === "string") {
          onPanelToggle(detail?.panelName);
        }
      },
      [onPanelToggle]
    );
    const onMobilePanelOpen = index.reactExports.useCallback(
      ({ detail }) => {
        if (typeof detail?.panelName === "string") {
          onEvent?.(detail?.panelName, constants.MOBILE_HEADER_EVENT_NAMES.openEvent);
          setVisiblePanel(detail?.panelName);
        }
      },
      [onEvent]
    );
    const onMobilePanelClose = index.reactExports.useCallback(
      ({ detail }) => {
        if (typeof detail?.panelName === "string") {
          onEvent?.(detail?.panelName, constants.MOBILE_HEADER_EVENT_NAMES.closeEvent);
          setVisiblePanel(null);
        }
      },
      [onEvent]
    );
    const onBurgerOpen = index.reactExports.useCallback(() => {
      onEvent?.(constants.BURGER_PANEL_ITEM_ID, constants.MOBILE_HEADER_EVENT_NAMES.openEvent);
      setVisiblePanel(constants.BURGER_PANEL_ITEM_ID);
    }, [onEvent]);
    const onBurgerClose = index.reactExports.useCallback(() => {
      onEvent?.(constants.BURGER_PANEL_ITEM_ID, constants.MOBILE_HEADER_EVENT_NAMES.closeEvent);
      setVisiblePanel(null);
    }, [onEvent]);
    const onCloseDrawer = index.reactExports.useCallback(() => {
      if (visiblePanel) {
        onEvent?.(visiblePanel, constants.MOBILE_HEADER_EVENT_NAMES.closeEvent);
      }
      setVisiblePanel(null);
    }, [visiblePanel, onEvent]);
    const onBurgerMenuItemClick = index.reactExports.useCallback(
      (item) => {
        const closeMenuOnClick = item.closeMenuOnClick ?? true;
        if (closeMenuOnClick) {
          onBurgerClose();
        }
      },
      [onBurgerClose]
    );
    const renderBurgerMenuFooter = index.reactExports.useCallback(
      () => burgerMenu.renderFooter?.({
        size,
        isCompact: compact
      }),
      [burgerMenu, size, compact]
    );
    const onLogoClick = index.reactExports.useCallback(
      (event) => {
        onClosePanel?.();
        logo.onClick?.(event);
      },
      [logo, onClosePanel]
    );
    const burgerPanelItem = index.reactExports.useMemo(
      () => ({
        id: constants.BURGER_PANEL_ITEM_ID,
        content: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
          BurgerMenu.BurgerMenu,
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
    index.reactExports.useEffect(() => {
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
    return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b({ compact }, className), ref: targetRef, children: [
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("header", { className: b("header"), style: { height: size }, children: [
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
          Burger.Burger,
          {
            opened: visiblePanel === burgerPanelItem.id,
            onClick: () => onPanelToggle(constants.BURGER_PANEL_ITEM_ID),
            className: b("burger"),
            closeTitle: burgerCloseTitle,
            openTitle: burgerOpenTitle
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(MobileLogo.MobileLogo, { ...logo, compact, onClick: onLogoClick }),
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("side-item"), children: sideItemRenderContent?.({ size }) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
        Drawer.Drawer,
        {
          className: b("panels"),
          onVeilClick: onCloseDrawer,
          onEscape: onCloseDrawer,
          style: { top: size },
          children: [burgerPanelItem, ...panelItems].map((item) => /* @__PURE__ */ index.reactExports.createElement(
            Drawer.DrawerItem,
            {
              ...item,
              key: item.id,
              visible: visiblePanel === item.id,
              className: b("panel-item", item.className)
            }
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
        Content.Content,
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

exports.MobileHeader = MobileHeader;
//# sourceMappingURL=MobileHeader.cjs.map
