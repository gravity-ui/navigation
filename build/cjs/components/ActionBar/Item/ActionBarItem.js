'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var cn = require('../../utils/cn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('action-bar-item');
const ActionBarItem = ({ children, className, pull, spacing = true }) => {
    return (React__default["default"].createElement("li", { className: b({ pull, spacing }, className), role: "menuitem" }, children));
};
ActionBarItem.displayName = 'ActionBar.Item';

exports.ActionBarItem = ActionBarItem;
//# sourceMappingURL=ActionBarItem.js.map
