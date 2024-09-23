import { jsx } from 'react/jsx-runtime';
import { block } from './index.es24.js';
/* empty css           */

const b = block("action-bar-group");
const ActionBarGroup = ({ children, className, pull }) => {
  return /* @__PURE__ */ jsx("ul", { className: b({ pull }, className), role: "group", children });
};
ActionBarGroup.displayName = "ActionBar.Group";

export { ActionBarGroup };
//# sourceMappingURL=index.es33.js.map
