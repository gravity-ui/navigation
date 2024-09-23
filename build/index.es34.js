import { jsx } from 'react/jsx-runtime';
import { block } from './index.es24.js';
/* empty css           */

const b = block("action-bar-item");
const ActionBarItem = ({ children, className, pull, spacing = true }) => {
  return /* @__PURE__ */ jsx("li", { className: b({ pull, spacing }, className), role: "menuitem", children });
};
ActionBarItem.displayName = "ActionBar.Item";

export { ActionBarItem };
//# sourceMappingURL=index.es34.js.map
