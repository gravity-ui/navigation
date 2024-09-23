'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const uikit = require('@gravity-ui/uikit');
const cn = require('../../utils/cn.cjs');
;/* empty css                */

const b = cn.block("footer-menu-item");
const MenuItem = ({ text, className, ...menuItemProps }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(uikit.Menu.Item, { className: b(null, className), ...menuItemProps, children: text });
};

exports.MenuItem = MenuItem;
//# sourceMappingURL=MenuItem.cjs.map