import { jsx } from 'react/jsx-runtime';
import { block } from '../../utils/cn.mjs';
/* empty css                         */

const b = block("action-bar-separator");
const ActionBarSeparator = () => {
  return /* @__PURE__ */ jsx("li", { role: "separator", className: b(), "aria-hidden": true });
};
ActionBarSeparator.displayName = "ActionBar.Separator";

export { ActionBarSeparator };
//# sourceMappingURL=ActionBarSeparator.mjs.map
