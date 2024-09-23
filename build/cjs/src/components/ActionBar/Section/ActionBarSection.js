'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var cn = require('../../utils/cn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('action-bar-section');
const ActionBarSection = ({ children, type = 'primary' }) => {
    return (React__default["default"].createElement("div", { className: b({ type }), role: "menu" }, children));
};
ActionBarSection.displayName = 'ActionBar.Section';

exports.ActionBarSection = ActionBarSection;
//# sourceMappingURL=ActionBarSection.js.map
