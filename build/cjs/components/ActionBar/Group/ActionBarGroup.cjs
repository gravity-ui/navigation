'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const cn = require('../../utils/cn.cjs');
;/* empty css                      */

const b = cn.block("action-bar-group");
const ActionBarGroup = ({ children, className, pull }) => {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("ul", { className: b({ pull }, className), role: "group", children });
};
ActionBarGroup.displayName = "ActionBar.Group";

exports.ActionBarGroup = ActionBarGroup;
//# sourceMappingURL=ActionBarGroup.cjs.map
