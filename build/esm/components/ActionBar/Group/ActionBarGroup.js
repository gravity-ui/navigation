import React__default from 'react';
import { block } from '../../utils/cn.js';

const b = block('action-bar-group');
const ActionBarGroup = ({ children, className, pull }) => {
    return (React__default.createElement("ul", { className: b({ pull }, className), role: "group" }, children));
};
ActionBarGroup.displayName = 'ActionBar.Group';

export { ActionBarGroup };
//# sourceMappingURL=ActionBarGroup.js.map
