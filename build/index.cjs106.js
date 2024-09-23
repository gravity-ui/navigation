'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const Drawer = require('./index.cjs8.js');
const AsideHeaderContext = require('./index.cjs3.js');
const utils = require('./index.cjs27.js');

const Panels = () => {
  const { panelItems, onClosePanel, size } = AsideHeaderContext.useAsideHeaderInnerContext();
  return panelItems ? /* @__PURE__ */ jsxRuntime.jsx(
    Drawer.Drawer,
    {
      className: utils.b("panels"),
      onVeilClick: onClosePanel,
      onEscape: onClosePanel,
      style: { left: size },
      children: panelItems.map((item) => /* @__PURE__ */ jsxRuntime.jsx(Drawer.DrawerItem, { ...item }, item.id))
    }
  ) : null;
};

exports.Panels = Panels;
//# sourceMappingURL=index.cjs106.js.map
