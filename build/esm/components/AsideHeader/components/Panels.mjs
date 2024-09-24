import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import { Drawer, DrawerItem } from '../../Drawer/Drawer.mjs';
import { useAsideHeaderInnerContext } from '../AsideHeaderContext.mjs';
import { b } from '../utils.mjs';

const Panels = () => {
  const { panelItems, onClosePanel, size } = useAsideHeaderInnerContext();
  return panelItems ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Drawer,
    {
      className: b("panels"),
      onVeilClick: onClosePanel,
      onEscape: onClosePanel,
      style: { left: size },
      children: panelItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerItem, { ...item }, item.id))
    }
  ) : null;
};

export { Panels };
//# sourceMappingURL=Panels.mjs.map
