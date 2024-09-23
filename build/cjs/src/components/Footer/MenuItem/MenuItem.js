'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../../node_modules/tslib/tslib.es6.js');
var React = require('react');
var uikit = require('@gravity-ui/uikit');
var cn = require('../../utils/cn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('footer-menu-item');
const MenuItem = (_a) => {
    var { text, className } = _a, menuItemProps = tslib_es6.__rest(_a, ["text", "className"]);
    return (React__default["default"].createElement(uikit.Menu.Item, Object.assign({ className: b(null, className) }, menuItemProps), text));
};

exports.MenuItem = MenuItem;
//# sourceMappingURL=MenuItem.js.map
