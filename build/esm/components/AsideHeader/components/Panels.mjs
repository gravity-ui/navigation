import { jsx } from 'react/jsx-runtime';
import { Drawer, DrawerItem } from '../../Drawer/Drawer.mjs';
import { useAsideHeaderInnerContext } from '../AsideHeaderContext.mjs';
import { b } from '../utils.mjs';

const Panels = () => {
  const { panelItems, onClosePanel, size } = useAsideHeaderInnerContext();
  return panelItems ? /* @__PURE__ */ jsx(
    Drawer,
    {
      className: b("panels"),
      onVeilClick: onClosePanel,
      onEscape: onClosePanel,
      style: { left: size },
      children: panelItems.map((item) => /* @__PURE__ */ jsx(DrawerItem, { ...item }, item.id))
    }
  ) : null;
};

export { Panels };
//# sourceMappingURL=Panels.mjs.map
