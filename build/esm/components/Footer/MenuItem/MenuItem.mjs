import { jsx } from 'react/jsx-runtime';
import { Menu } from '@gravity-ui/uikit';
import { block } from '../../utils/cn.mjs';
/* empty css               */

const b = block("footer-menu-item");
const MenuItem = ({ text, className, ...menuItemProps }) => {
  return /* @__PURE__ */ jsx(Menu.Item, { className: b(null, className), ...menuItemProps, children: text });
};

export { MenuItem };
//# sourceMappingURL=MenuItem.mjs.map
