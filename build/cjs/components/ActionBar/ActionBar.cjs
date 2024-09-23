'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const cn = require('../utils/cn.cjs');
const ActionBarGroup = require('./Group/ActionBarGroup.cjs');
const ActionBarItem = require('./Item/ActionBarItem.cjs');
const ActionBarSection = require('./Section/ActionBarSection.cjs');
const ActionBarSeparator = require('./Separator/ActionBarSeparator.cjs');
;/* empty css                 */

const b = cn.block("action-bar");
const ActionBar = ({ children, className, "aria-label": ariaLabel }) => {
  return /* @__PURE__ */ jsxRuntime.jsx("section", { className: b(null, className), "aria-label": ariaLabel, children });
};
ActionBar.displayName = "ActionBar";
const PublicActionBar = Object.assign(ActionBar, {
  Section: ActionBarSection.ActionBarSection,
  Group: ActionBarGroup.ActionBarGroup,
  Item: ActionBarItem.ActionBarItem,
  Separator: ActionBarSeparator.ActionBarSeparator
});

exports.ActionBar = PublicActionBar;
//# sourceMappingURL=ActionBar.cjs.map
