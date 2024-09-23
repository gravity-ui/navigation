import { jsx } from 'react/jsx-runtime';
import { block } from '../../utils/cn.mjs';
/* empty css                     */

const b = block("action-bar-group");
const ActionBarGroup = ({ children, className, pull }) => {
  return /* @__PURE__ */ jsx("ul", { className: b({ pull }, className), role: "group", children });
};
ActionBarGroup.displayName = "ActionBar.Group";

export { ActionBarGroup };
//# sourceMappingURL=ActionBarGroup.mjs.map
