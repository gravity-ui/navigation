import { jsx } from 'react/jsx-runtime';
import { block } from './index.es24.js';
import { ActionBarGroup } from './index.es33.js';
import { ActionBarItem } from './index.es34.js';
import { ActionBarSection } from './index.es35.js';
import { ActionBarSeparator } from './index.es36.js';
/* empty css           */

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
//# sourceMappingURL=index.es9.js.map
