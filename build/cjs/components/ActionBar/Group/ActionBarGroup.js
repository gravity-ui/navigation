'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var cn = require('../../utils/cn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('action-bar-group');
const ActionBarGroup = ({ children, className, pull }) => {
    return (React__default["default"].createElement("ul", { className: b({ pull }, className), role: "group" }, children));
};
ActionBarGroup.displayName = 'ActionBar.Group';

exports.ActionBarGroup = ActionBarGroup;
//# sourceMappingURL=ActionBarGroup.js.map
