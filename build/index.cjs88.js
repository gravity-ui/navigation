'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const uikit = require('@gravity-ui/uikit');
const cn = require('./index.cjs24.js');
;/* empty css              */

const b = cn.block("footer-menu-item");
const MenuItem = ({ text, className, ...menuItemProps }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(uikit.Menu.Item, { className: b(null, className), ...menuItemProps, children: text });
};

exports.MenuItem = MenuItem;
//# sourceMappingURL=index.cjs88.js.map
