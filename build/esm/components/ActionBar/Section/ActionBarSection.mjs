import { jsx } from 'react/jsx-runtime';
import { block } from '../../utils/cn.mjs';
/* empty css                       */

const b = block("action-bar-section");
const ActionBarSection = ({ children, type = "primary" }) => {
  return /* @__PURE__ */ jsx("div", { className: b({ type }), role: "menu", children });
};
ActionBarSection.displayName = "ActionBar.Section";

export { ActionBarSection };
//# sourceMappingURL=ActionBarSection.mjs.map
