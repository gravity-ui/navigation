import React__default from 'react';
import { block } from '../../utils/cn.js';

const b = block('action-bar-section');
const ActionBarSection = ({ children, type = 'primary' }) => {
    return (React__default.createElement("div", { className: b({ type }), role: "menu" }, children));
};
ActionBarSection.displayName = 'ActionBar.Section';

export { ActionBarSection };
//# sourceMappingURL=ActionBarSection.js.map
