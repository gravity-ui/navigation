import { jsx } from 'react/jsx-runtime';
import { block } from './index.es24.js';
/* empty css           */

const b = block("action-bar-section");
const ActionBarSection = ({ children, type = "primary" }) => {
  return /* @__PURE__ */ jsx("div", { className: b({ type }), role: "menu", children });
};
ActionBarSection.displayName = "ActionBar.Section";

export { ActionBarSection };
//# sourceMappingURL=index.es35.js.map
