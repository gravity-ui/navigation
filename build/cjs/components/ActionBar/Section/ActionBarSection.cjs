'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const cn = require('../../utils/cn.cjs');
;/* empty css                        */

const b = cn.block("action-bar-section");
const ActionBarSection = ({ children, type = "primary" }) => {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b({ type }), role: "menu", children });
};
ActionBarSection.displayName = "ActionBar.Section";

exports.ActionBarSection = ActionBarSection;
//# sourceMappingURL=ActionBarSection.cjs.map
