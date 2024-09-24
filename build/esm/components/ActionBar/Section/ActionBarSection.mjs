import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import { block } from '../../utils/cn.mjs';
/* empty css                       */

const b = block("action-bar-section");
const ActionBarSection = ({ children, type = "primary" }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b({ type }), role: "menu", children });
};
ActionBarSection.displayName = "ActionBar.Section";

export { ActionBarSection };
//# sourceMappingURL=ActionBarSection.mjs.map
