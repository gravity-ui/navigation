import React__default from 'react';
import { block } from '../../utils/cn.js';

const b = block('action-bar-item');
const ActionBarItem = ({ children, className, pull, spacing = true }) => {
    return (React__default.createElement("li", { className: b({ pull, spacing }, className), role: "menuitem" }, children));
};
ActionBarItem.displayName = 'ActionBar.Item';

export { ActionBarItem };
//# sourceMappingURL=ActionBarItem.js.map
