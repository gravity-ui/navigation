import React__default from 'react';
import { block } from '../utils/cn.js';
import { ActionBarGroup } from './Group/ActionBarGroup.js';
import { ActionBarItem } from './Item/ActionBarItem.js';
import { ActionBarSection } from './Section/ActionBarSection.js';
import { ActionBarSeparator } from './Separator/ActionBarSeparator.js';

const b = block('action-bar');
const ActionBar = ({ children, className, 'aria-label': ariaLabel }) => {
    return (React__default.createElement("section", { className: b(null, className), "aria-label": ariaLabel }, children));
};
ActionBar.displayName = 'ActionBar';
const PublicActionBar = Object.assign(ActionBar, {
    Section: ActionBarSection,
    Group: ActionBarGroup,
    Item: ActionBarItem,
    Separator: ActionBarSeparator,
});

export { PublicActionBar as ActionBar };
//# sourceMappingURL=ActionBar.js.map
