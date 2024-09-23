'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var cn = require('../../../utils/cn.js');
var constants = require('../../constants.js');
var utils = require('../../utils.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('burger-composite-bar');
const Item = ({ item, onItemClick }) => {
    const { icon, type = 'regular', iconSize = constants.MOBILE_HEADER_ICON_SIZE } = item;
    if (type === 'divider') {
        return React__default["default"].createElement("div", { className: b('menu-divider') });
    }
    const node = (React__default["default"].createElement("div", { className: b('item', { type }), onClick: () => {
            if (typeof item.onItemClick === 'function') {
                item.onItemClick(item);
            }
            if (type === 'regular') {
                onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(item);
            }
        } },
        React__default["default"].createElement("div", { className: b('item-icon-place') }, icon && React__default["default"].createElement(uikit.Icon, { data: icon, size: iconSize, className: b('item-icon') })),
        React__default["default"].createElement("div", { className: b('item-title') }, item.title)));
    if (typeof item.itemWrapper === 'function') {
        return item.itemWrapper(node, item);
    }
    return item.link ? (React__default["default"].createElement("a", { href: item.link, className: b('link') }, node)) : (node);
};
Item.displayName = 'Item';
const BurgerCompositeBar = React__default["default"].memo(({ items, onItemClick }) => {
    return (React__default["default"].createElement("nav", { className: b() },
        React__default["default"].createElement(uikit.List, { items: items, selectedItemIndex: utils.getSelectedItemIndex(items), itemHeight: utils.getItemHeight, itemClassName: b('root-menu-item'), virtualized: false, filterable: false, sortable: false, renderItem: (item) => React__default["default"].createElement(Item, { item: item, onItemClick: onItemClick }) })));
});
BurgerCompositeBar.displayName = 'BurgerCompositeBar';

exports.BurgerCompositeBar = BurgerCompositeBar;
//# sourceMappingURL=BurgerCompositeBar.js.map
