'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var cn = require('../../utils/cn.js');
var BurgerCompositeBar = require('./BurgerCompositeBar/BurgerCompositeBar.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('mobile-header-burger-menu');
const BurgerMenu = React__default["default"].memo(({ items = [], renderFooter, modalItem, className, onItemClick }) => {
    var _a;
    return (React__default["default"].createElement("div", { className: b(null, className) },
        modalItem && (React__default["default"].createElement(uikit.Sheet, { visible: modalItem.visible, id: modalItem.id, title: modalItem.title, onClose: modalItem.onClose, contentClassName: modalItem.contentClassName, className: modalItem.className }, (_a = modalItem.renderContent) === null || _a === void 0 ? void 0 : _a.call(modalItem))),
        React__default["default"].createElement(BurgerCompositeBar.BurgerCompositeBar, { items: items, onItemClick: onItemClick }),
        renderFooter && React__default["default"].createElement("div", { className: b('footer') }, renderFooter === null || renderFooter === void 0 ? void 0 : renderFooter())));
});
BurgerMenu.displayName = 'BurgerMenu';

exports.BurgerMenu = BurgerMenu;
//# sourceMappingURL=BurgerMenu.js.map
