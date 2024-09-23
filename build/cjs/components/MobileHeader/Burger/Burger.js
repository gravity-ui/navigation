'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var cn = require('../../utils/cn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('mobile-header-burger');
const Burger = React__default["default"].memo(({ closeTitle, openTitle, opened, className, onClick }) => (React__default["default"].createElement("button", { className: b({ opened }, className), onClick: onClick, "aria-label": opened ? closeTitle : openTitle },
    React__default["default"].createElement("span", { className: b('icon') },
        React__default["default"].createElement("span", { className: b('icon-dash') })))));
Burger.displayName = 'Burger';

exports.Burger = Burger;
//# sourceMappingURL=Burger.js.map
