import React__default, { useState, useCallback, useMemo, useEffect } from 'react';
import { useForwardRef } from '../../hooks/useForwardRef.js';
import { Content } from '../Content/Content.js';
import { Drawer, DrawerItem } from '../Drawer/Drawer.js';
import { MobileLogo } from '../MobileLogo/MobileLogo.js';
import { block } from '../utils/cn.js';
import { Burger } from './Burger/Burger.js';
import { BurgerMenu } from './BurgerMenu/BurgerMenu.js';
import { MOBILE_HEADER_EVENT_NAMES, BURGER_PANEL_ITEM_ID, MOBILE_HEADER_COMPACT_HEIGHT, MOBILE_HEADER_EXPANDED_HEIGHT } from './constants.js';
import i18n from './i18n/index.js';

const b = block('mobile-header');
const MobileHeader = React__default.forwardRef(({ logo, burgerMenu, burgerCloseTitle = i18n('burger_button_close'), burgerOpenTitle = i18n('burger_button_open'), panelItems = [], renderContent, sideItemRenderContent, onClosePanel, onEvent, className, contentClassName, }, ref) => {
    const targetRef = useForwardRef(ref);
    const [compact] = useState(true);
    const [visiblePanel, setVisiblePanel] = useState(null);
    // for expand top panel cases (i.e. switch service panel). Will be removed if not used in future design
    const size = compact ? MOBILE_HEADER_COMPACT_HEIGHT : MOBILE_HEADER_EXPANDED_HEIGHT;
    const onPanelToggle = useCallback((name) => {
        if (!name)
            return;
        setVisiblePanel((prev) => {
            const panelOpen = prev === name;
            onEvent === null || onEvent === void 0 ? void 0 : onEvent(name, panelOpen
                ? MOBILE_HEADER_EVENT_NAMES.closeEvent
                : MOBILE_HEADER_EVENT_NAMES.openEvent);
            return panelOpen ? null : name;
        });
    }, [onEvent]);
    const onMobilePanelToggle = useCallback(({ detail }) => {
        if (typeof (detail === null || detail === void 0 ? void 0 : detail.panelName) === 'string') {
            onPanelToggle(detail === null || detail === void 0 ? void 0 : detail.panelName);
        }
    }, [onPanelToggle]);
    const onMobilePanelOpen = useCallback(({ detail }) => {
        if (typeof (detail === null || detail === void 0 ? void 0 : detail.panelName) === 'string') {
            onEvent === null || onEvent === void 0 ? void 0 : onEvent(detail === null || detail === void 0 ? void 0 : detail.panelName, MOBILE_HEADER_EVENT_NAMES.openEvent);
            setVisiblePanel(detail === null || detail === void 0 ? void 0 : detail.panelName);
        }
    }, [onEvent]);
    const onMobilePanelClose = useCallback(({ detail }) => {
        if (typeof (detail === null || detail === void 0 ? void 0 : detail.panelName) === 'string') {
            onEvent === null || onEvent === void 0 ? void 0 : onEvent(detail === null || detail === void 0 ? void 0 : detail.panelName, MOBILE_HEADER_EVENT_NAMES.closeEvent);
            setVisiblePanel(null);
        }
    }, [onEvent]);
    const onBurgerOpen = useCallback(() => {
        onEvent === null || onEvent === void 0 ? void 0 : onEvent(BURGER_PANEL_ITEM_ID, MOBILE_HEADER_EVENT_NAMES.openEvent);
        setVisiblePanel(BURGER_PANEL_ITEM_ID);
    }, [onEvent]);
    const onBurgerClose = useCallback(() => {
        onEvent === null || onEvent === void 0 ? void 0 : onEvent(BURGER_PANEL_ITEM_ID, MOBILE_HEADER_EVENT_NAMES.closeEvent);
        setVisiblePanel(null);
    }, [onEvent]);
    const onCloseDrawer = useCallback(() => {
        if (visiblePanel) {
            onEvent === null || onEvent === void 0 ? void 0 : onEvent(visiblePanel, MOBILE_HEADER_EVENT_NAMES.closeEvent);
        }
        setVisiblePanel(null);
    }, [visiblePanel, onEvent]);
    const onBurgerMenuItemClick = useCallback((item) => {
        var _a;
        const closeMenuOnClick = (_a = item.closeMenuOnClick) !== null && _a !== void 0 ? _a : true;
        if (closeMenuOnClick) {
            onBurgerClose();
        }
    }, [onBurgerClose]);
    const renderBurgerMenuFooter = useCallback(() => {
        var _a;
        return (_a = burgerMenu.renderFooter) === null || _a === void 0 ? void 0 : _a.call(burgerMenu, {
            size,
            isCompact: compact,
        });
    }, [burgerMenu, size, compact]);
    const onLogoClick = useCallback((event) => {
        var _a;
        onClosePanel === null || onClosePanel === void 0 ? void 0 : onClosePanel();
        (_a = logo.onClick) === null || _a === void 0 ? void 0 : _a.call(logo, event);
    }, [logo, onClosePanel]);
    const burgerPanelItem = useMemo(() => ({
        id: BURGER_PANEL_ITEM_ID,
        content: (React__default.createElement(BurgerMenu, { items: burgerMenu.items, modalItem: burgerMenu.modalItem, renderFooter: renderBurgerMenuFooter, onItemClick: onBurgerMenuItemClick, className: b('burger-menu') })),
    }), [burgerMenu.items, burgerMenu.modalItem, onBurgerMenuItemClick, renderBurgerMenuFooter]);
    useEffect(() => {
        const node = targetRef === null || targetRef === void 0 ? void 0 : targetRef.current;
        if (node) {
            node.addEventListener('MOBILE_BURGER_OPEN', onBurgerOpen);
            node.addEventListener('MOBILE_BURGER_CLOSE', onBurgerClose);
            node.addEventListener('MOBILE_PANEL_TOGGLE', onMobilePanelToggle);
            node.addEventListener('MOBILE_PANEL_OPEN', onMobilePanelOpen);
            node.addEventListener('MOBILE_PANEL_CLOSE', onMobilePanelClose);
        }
        return () => {
            if (node) {
                node.removeEventListener('MOBILE_BURGER_OPEN', onBurgerOpen);
                node.removeEventListener('MOBILE_BURGER_CLOSE', onBurgerClose);
                node.removeEventListener('MOBILE_PANEL_TOGGLE', onMobilePanelToggle);
                node.removeEventListener('MOBILE_PANEL_OPEN', onMobilePanelOpen);
                node.removeEventListener('MOBILE_PANEL_CLOSE', onMobilePanelClose);
            }
        };
    }, [
        targetRef,
        onBurgerClose,
        onBurgerOpen,
        onMobilePanelToggle,
        onMobilePanelOpen,
        onMobilePanelClose,
    ]);
    return (React__default.createElement("div", { className: b({ compact }, className), ref: targetRef },
        React__default.createElement("header", { className: b('header'), style: { height: size } },
            React__default.createElement(Burger, { opened: visiblePanel === burgerPanelItem.id, onClick: () => onPanelToggle(BURGER_PANEL_ITEM_ID), className: b('burger'), closeTitle: burgerCloseTitle, openTitle: burgerOpenTitle }),
            React__default.createElement(MobileLogo, Object.assign({}, logo, { compact: compact, onClick: onLogoClick })),
            React__default.createElement("div", { className: b('side-item') }, sideItemRenderContent === null || sideItemRenderContent === void 0 ? void 0 : sideItemRenderContent({ size }))),
        React__default.createElement(Drawer, { className: b('panels'), onVeilClick: onCloseDrawer, onEscape: onCloseDrawer, style: { top: size } }, [burgerPanelItem, ...panelItems].map((item) => (React__default.createElement(DrawerItem, Object.assign({}, item, { key: item.id, visible: visiblePanel === item.id, className: b('panel-item', item.className) }))))),
        React__default.createElement(Content, { size: size, renderContent: renderContent, className: b('content', contentClassName), cssSizeVariableName: "--mobile-header-size" })));
});
MobileHeader.displayName = 'MobileHeader';

export { MobileHeader };
//# sourceMappingURL=MobileHeader.js.map
