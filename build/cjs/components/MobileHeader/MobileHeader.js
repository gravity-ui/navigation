'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var useForwardRef = require('../../hooks/useForwardRef.js');
var Content = require('../Content/Content.js');
var Drawer = require('../Drawer/Drawer.js');
var MobileLogo = require('../MobileLogo/MobileLogo.js');
var cn = require('../utils/cn.js');
var Burger = require('./Burger/Burger.js');
var BurgerMenu = require('./BurgerMenu/BurgerMenu.js');
var constants = require('./constants.js');
var index = require('./i18n/index.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('mobile-header');
const MobileHeader = React__default["default"].forwardRef(({ logo, burgerMenu, burgerCloseTitle = index["default"]('burger_button_close'), burgerOpenTitle = index["default"]('burger_button_open'), panelItems = [], renderContent, sideItemRenderContent, onClosePanel, onEvent, className, contentClassName, }, ref) => {
    const targetRef = useForwardRef.useForwardRef(ref);
    const [compact] = React.useState(true);
    const [visiblePanel, setVisiblePanel] = React.useState(null);
    // for expand top panel cases (i.e. switch service panel). Will be removed if not used in future design
    const size = compact ? constants.MOBILE_HEADER_COMPACT_HEIGHT : constants.MOBILE_HEADER_EXPANDED_HEIGHT;
    const onPanelToggle = React.useCallback((name) => {
        if (!name)
            return;
        setVisiblePanel((prev) => {
            const panelOpen = prev === name;
            onEvent === null || onEvent === void 0 ? void 0 : onEvent(name, panelOpen
                ? constants.MOBILE_HEADER_EVENT_NAMES.closeEvent
                : constants.MOBILE_HEADER_EVENT_NAMES.openEvent);
            return panelOpen ? null : name;
        });
    }, [onEvent]);
    const onMobilePanelToggle = React.useCallback(({ detail }) => {
        if (typeof (detail === null || detail === void 0 ? void 0 : detail.panelName) === 'string') {
            onPanelToggle(detail === null || detail === void 0 ? void 0 : detail.panelName);
        }
    }, [onPanelToggle]);
    const onMobilePanelOpen = React.useCallback(({ detail }) => {
        if (typeof (detail === null || detail === void 0 ? void 0 : detail.panelName) === 'string') {
            onEvent === null || onEvent === void 0 ? void 0 : onEvent(detail === null || detail === void 0 ? void 0 : detail.panelName, constants.MOBILE_HEADER_EVENT_NAMES.openEvent);
            setVisiblePanel(detail === null || detail === void 0 ? void 0 : detail.panelName);
        }
    }, [onEvent]);
    const onMobilePanelClose = React.useCallback(({ detail }) => {
        if (typeof (detail === null || detail === void 0 ? void 0 : detail.panelName) === 'string') {
            onEvent === null || onEvent === void 0 ? void 0 : onEvent(detail === null || detail === void 0 ? void 0 : detail.panelName, constants.MOBILE_HEADER_EVENT_NAMES.closeEvent);
            setVisiblePanel(null);
        }
    }, [onEvent]);
    const onBurgerOpen = React.useCallback(() => {
        onEvent === null || onEvent === void 0 ? void 0 : onEvent(constants.BURGER_PANEL_ITEM_ID, constants.MOBILE_HEADER_EVENT_NAMES.openEvent);
        setVisiblePanel(constants.BURGER_PANEL_ITEM_ID);
    }, [onEvent]);
    const onBurgerClose = React.useCallback(() => {
        onEvent === null || onEvent === void 0 ? void 0 : onEvent(constants.BURGER_PANEL_ITEM_ID, constants.MOBILE_HEADER_EVENT_NAMES.closeEvent);
        setVisiblePanel(null);
    }, [onEvent]);
    const onCloseDrawer = React.useCallback(() => {
        if (visiblePanel) {
            onEvent === null || onEvent === void 0 ? void 0 : onEvent(visiblePanel, constants.MOBILE_HEADER_EVENT_NAMES.closeEvent);
        }
        setVisiblePanel(null);
    }, [visiblePanel, onEvent]);
    const onBurgerMenuItemClick = React.useCallback((item) => {
        var _a;
        const closeMenuOnClick = (_a = item.closeMenuOnClick) !== null && _a !== void 0 ? _a : true;
        if (closeMenuOnClick) {
            onBurgerClose();
        }
    }, [onBurgerClose]);
    const renderBurgerMenuFooter = React.useCallback(() => {
        var _a;
        return (_a = burgerMenu.renderFooter) === null || _a === void 0 ? void 0 : _a.call(burgerMenu, {
            size,
            isCompact: compact,
        });
    }, [burgerMenu, size, compact]);
    const onLogoClick = React.useCallback((event) => {
        var _a;
        onClosePanel === null || onClosePanel === void 0 ? void 0 : onClosePanel();
        (_a = logo.onClick) === null || _a === void 0 ? void 0 : _a.call(logo, event);
    }, [logo, onClosePanel]);
    const burgerPanelItem = React.useMemo(() => ({
        id: constants.BURGER_PANEL_ITEM_ID,
        content: (React__default["default"].createElement(BurgerMenu.BurgerMenu, { items: burgerMenu.items, modalItem: burgerMenu.modalItem, renderFooter: renderBurgerMenuFooter, onItemClick: onBurgerMenuItemClick, className: b('burger-menu') })),
    }), [burgerMenu.items, burgerMenu.modalItem, onBurgerMenuItemClick, renderBurgerMenuFooter]);
    React.useEffect(() => {
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
    return (React__default["default"].createElement("div", { className: b({ compact }, className), ref: targetRef },
        React__default["default"].createElement("header", { className: b('header'), style: { height: size } },
            React__default["default"].createElement(Burger.Burger, { opened: visiblePanel === burgerPanelItem.id, onClick: () => onPanelToggle(constants.BURGER_PANEL_ITEM_ID), className: b('burger'), closeTitle: burgerCloseTitle, openTitle: burgerOpenTitle }),
            React__default["default"].createElement(MobileLogo.MobileLogo, Object.assign({}, logo, { compact: compact, onClick: onLogoClick })),
            React__default["default"].createElement("div", { className: b('side-item') }, sideItemRenderContent === null || sideItemRenderContent === void 0 ? void 0 : sideItemRenderContent({ size }))),
        React__default["default"].createElement(Drawer.Drawer, { className: b('panels'), onVeilClick: onCloseDrawer, onEscape: onCloseDrawer, style: { top: size } }, [burgerPanelItem, ...panelItems].map((item) => (React__default["default"].createElement(Drawer.DrawerItem, Object.assign({}, item, { key: item.id, visible: visiblePanel === item.id, className: b('panel-item', item.className) }))))),
        React__default["default"].createElement(Content.Content, { size: size, renderContent: renderContent, className: b('content', contentClassName), cssSizeVariableName: "--mobile-header-size" })));
});
MobileHeader.displayName = 'MobileHeader';

exports.MobileHeader = MobileHeader;
//# sourceMappingURL=MobileHeader.js.map
