'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const cn = require('./index.cjs24.js');
;/* empty css             */

const b = cn.block("action-bar-item");
const ActionBarItem = ({ children, className, pull, spacing = true }) => {
  return /* @__PURE__ */ jsxRuntime.jsx("li", { className: b({ pull, spacing }, className), role: "menuitem", children });
};
ActionBarItem.displayName = "ActionBar.Item";

exports.ActionBarItem = ActionBarItem;
//# sourceMappingURL=index.cjs34.js.map
