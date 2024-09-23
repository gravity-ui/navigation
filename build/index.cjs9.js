'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const cn = require('./index.cjs24.js');
const ActionBarGroup = require('./index.cjs33.js');
const ActionBarItem = require('./index.cjs34.js');
const ActionBarSection = require('./index.cjs35.js');
const ActionBarSeparator = require('./index.cjs36.js');
;/* empty css             */

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
//# sourceMappingURL=index.cjs9.js.map
