'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var cn = require('../utils/cn.js');
var ActionBarGroup = require('./Group/ActionBarGroup.js');
var ActionBarItem = require('./Item/ActionBarItem.js');
var ActionBarSection = require('./Section/ActionBarSection.js');
var ActionBarSeparator = require('./Separator/ActionBarSeparator.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('action-bar');
const ActionBar = ({ children, className, 'aria-label': ariaLabel }) => {
    return (React__default["default"].createElement("section", { className: b(null, className), "aria-label": ariaLabel }, children));
};
ActionBar.displayName = 'ActionBar';
const PublicActionBar = Object.assign(ActionBar, {
    Section: ActionBarSection.ActionBarSection,
    Group: ActionBarGroup.ActionBarGroup,
    Item: ActionBarItem.ActionBarItem,
    Separator: ActionBarSeparator.ActionBarSeparator,
});

exports.ActionBar = PublicActionBar;
//# sourceMappingURL=ActionBar.js.map
