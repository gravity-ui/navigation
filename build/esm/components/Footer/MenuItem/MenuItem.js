import { __rest } from 'tslib';
import React__default from 'react';
import { Menu } from '@gravity-ui/uikit';
import { block } from '../../utils/cn.js';

const b = block('footer-menu-item');
const MenuItem = (_a) => {
    var { text, className } = _a, menuItemProps = __rest(_a, ["text", "className"]);
    return (React__default.createElement(Menu.Item, Object.assign({ className: b(null, className) }, menuItemProps), text));
};

export { MenuItem };
//# sourceMappingURL=MenuItem.js.map
