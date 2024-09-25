import { jsx } from 'react/jsx-runtime';
import { block } from '../utils/cn.mjs';
import { ActionBarGroup } from './Group/ActionBarGroup.mjs';
import { ActionBarItem } from './Item/ActionBarItem.mjs';
import { ActionBarSection } from './Section/ActionBarSection.mjs';
import { ActionBarSeparator } from './Separator/ActionBarSeparator.mjs';
/* empty css                */

const b = block("action-bar");
const ActionBar = ({ children, className, "aria-label": ariaLabel }) => {
  return /* @__PURE__ */ jsx("section", { className: b(null, className), "aria-label": ariaLabel, children });
};
ActionBar.displayName = "ActionBar";
const PublicActionBar = Object.assign(ActionBar, {
  Section: ActionBarSection,
  Group: ActionBarGroup,
  Item: ActionBarItem,
  Separator: ActionBarSeparator
});

export { PublicActionBar as ActionBar };
//# sourceMappingURL=ActionBar.mjs.map
