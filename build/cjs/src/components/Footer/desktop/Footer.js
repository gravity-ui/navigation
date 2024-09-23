'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var useOverflowingHorizontalListItems = require('../../../hooks/useOverflowingHorizontalListItems/useOverflowingHorizontalListItems.js');
var Logo = require('../../Logo/Logo.js');
var cn = require('../../utils/cn.js');
var MenuItem = require('../MenuItem/MenuItem.js');
var moreItemsPopupProps = require('./constants/moreItemsPopupProps.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('footer');
const Footer = ({ className, menuItems: providedMenuItems, withDivider, moreButtonTitle, onMoreButtonClick, view = 'normal', logo, logoWrapperClassName, copyright, }) => {
    var _a;
    const menuContainerRef = React.useRef(null);
    const menuItems = view === 'clear' ? undefined : providedMenuItems;
    const { visibleItems, hiddenItems, measured } = useOverflowingHorizontalListItems.useOverflowingHorizontalListItems({
        containerRef: menuContainerRef,
        items: menuItems,
        itemSelector: `.${b('menu-item')}`,
        moreButtonWidth: 28,
    });
    const moreButtonProps = React.useMemo(() => ({
        title: moreButtonTitle,
    }), [moreButtonTitle]);
    const dropdownMenuItems = React.useMemo(() => hiddenItems.map((item) => (Object.assign(Object.assign({}, item), { action: item.onClick }))), [hiddenItems]);
    const shouldRenderLogo = view !== 'clear' && Boolean(logo);
    const shouldRenderMenu = ((_a = menuItems === null || menuItems === void 0 ? void 0 : menuItems.length) !== null && _a !== void 0 ? _a : 0) > 0;
    return (React__default["default"].createElement("footer", { className: b({ desktop: true, 'with-divider': withDivider, view }, className) },
        shouldRenderMenu && (React__default["default"].createElement("div", { className: b('menu', { measured }), ref: menuContainerRef },
            visibleItems.length > 0 && (React__default["default"].createElement(uikit.Menu, { className: b('list') }, visibleItems.map((item, index) => (React__default["default"].createElement(MenuItem.MenuItem, Object.assign({ key: index }, item, { className: b('menu-item', item.className) })))))),
            dropdownMenuItems.length > 0 && (React__default["default"].createElement(uikit.DropdownMenu, { items: dropdownMenuItems, switcherWrapperClassName: b('more-button'), popupProps: moreItemsPopupProps.moreItemsPopupProps, defaultSwitcherProps: moreButtonProps, onSwitcherClick: onMoreButtonClick })))),
        React__default["default"].createElement("div", { className: b('right') },
            React__default["default"].createElement("small", { className: b('copyright', { small: !(menuItems === null || menuItems === void 0 ? void 0 : menuItems.length) }) }, copyright),
            shouldRenderLogo && (React__default["default"].createElement("div", { className: logoWrapperClassName },
                React__default["default"].createElement(Logo.Logo, Object.assign({}, logo)))))));
};

exports.Footer = Footer;
//# sourceMappingURL=Footer.js.map
