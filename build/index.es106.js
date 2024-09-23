import { jsx } from 'react/jsx-runtime';
import { Drawer, DrawerItem } from './index.es8.js';
import { useAsideHeaderInnerContext } from './index.es3.js';
import { b } from './index.es27.js';

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
//# sourceMappingURL=index.es106.js.map
