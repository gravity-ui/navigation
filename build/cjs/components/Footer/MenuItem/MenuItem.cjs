'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const cn = require('../../utils/cn.cjs');
;/* empty css                */
const Menu = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Menu/Menu.cjs');

const b = cn.block("footer-menu-item");
const MenuItem = ({ text, className, ...menuItemProps }) => {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Menu.Menu.Item, { className: b(null, className), ...menuItemProps, children: text });
};

exports.MenuItem = MenuItem;
//# sourceMappingURL=MenuItem.cjs.map
