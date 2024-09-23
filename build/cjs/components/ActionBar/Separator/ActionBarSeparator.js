'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var cn = require('../../utils/cn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('action-bar-separator');
const ActionBarSeparator = () => {
    return React__default["default"].createElement("li", { role: "separator", className: b(), "aria-hidden": true });
};
ActionBarSeparator.displayName = 'ActionBar.Separator';

exports.ActionBarSeparator = ActionBarSeparator;
//# sourceMappingURL=ActionBarSeparator.js.map
