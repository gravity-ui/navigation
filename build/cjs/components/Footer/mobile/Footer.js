'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var icons = require('@gravity-ui/icons');
var uikit = require('@gravity-ui/uikit');
var useOverflowingHorizontalListItems = require('../../../hooks/useOverflowingHorizontalListItems/useOverflowingHorizontalListItems.js');
var Logo = require('../../Logo/Logo.js');
var cn = require('../../utils/cn.js');
var MenuItem = require('../MenuItem/MenuItem.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('footer');
const modalId = 'footer-more-items';
const MobileFooter = ({ className, menuItems: providedMenuItems, withDivider, moreButtonTitle, onMoreButtonClick, view = 'normal', logo, logoWrapperClassName, copyright, }) => {
    const [moreItemsMenuVisible, setMoreItemsMenuVisible] = React.useState(false);
    const menuContainerRef = React.useRef(null);
    const handleOpenMoreItemsMenu = React.useCallback((event) => {
        setMoreItemsMenuVisible(true);
        onMoreButtonClick === null || onMoreButtonClick === void 0 ? void 0 : onMoreButtonClick(event);
    }, [onMoreButtonClick]);
    const handleCloseMoreItemsMenu = React.useCallback(() => {
        setMoreItemsMenuVisible(false);
    }, []);
    const menuItems = view === 'clear' ? undefined : providedMenuItems;
    const { visibleItems, hiddenItems, measured } = useOverflowingHorizontalListItems.useOverflowingHorizontalListItems({
        containerRef: menuContainerRef,
        items: menuItems,
        itemSelector: `.${b('menu-item')}`,
        moreButtonWidth: 28,
    });
    const renderMenu = (items) => (React__default["default"].createElement(uikit.Menu, { className: b('list') }, items.map((item, index) => (React__default["default"].createElement(MenuItem.MenuItem, Object.assign({ key: index }, item, { className: b('menu-item', item.className) }))))));
    const shouldRenderLogo = view !== 'clear' && Boolean(logo);
    return (React__default["default"].createElement("footer", { className: b({ mobile: true, 'with-divider': withDivider, view }, className) },
        React__default["default"].createElement("div", { className: b('menu', { measured }), ref: menuContainerRef },
            visibleItems.length > 0 && renderMenu(visibleItems),
            hiddenItems.length > 0 && (React__default["default"].createElement(React__default["default"].Fragment, null,
                React__default["default"].createElement(uikit.Button, { view: "flat-secondary", size: "l", onClick: handleOpenMoreItemsMenu, title: moreButtonTitle },
                    React__default["default"].createElement(uikit.Icon, { data: icons.Ellipsis, size: 16 })),
                React__default["default"].createElement(uikit.Sheet, { id: modalId, visible: moreItemsMenuVisible, className: b('modal'), contentClassName: b('modal-content'), onClose: handleCloseMoreItemsMenu }, renderMenu(hiddenItems))))),
        React__default["default"].createElement("div", { className: b('bottom-row') },
            React__default["default"].createElement("small", { className: b('copyright') }, copyright),
            shouldRenderLogo && (React__default["default"].createElement("div", { className: logoWrapperClassName },
                React__default["default"].createElement(Logo.Logo, Object.assign({}, logo)))))));
};

exports.MobileFooter = MobileFooter;
//# sourceMappingURL=Footer.js.map
