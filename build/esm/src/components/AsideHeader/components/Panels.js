import React__default from 'react';
import { Drawer, DrawerItem } from '../../Drawer/Drawer.js';
import { useAsideHeaderInnerContext } from '../AsideHeaderContext.js';
import { b } from '../utils.js';

const Panels = () => {
    const { panelItems, onClosePanel, size } = useAsideHeaderInnerContext();
    return panelItems ? (React__default.createElement(Drawer, { className: b('panels'), onVeilClick: onClosePanel, onEscape: onClosePanel, style: { left: size } }, panelItems.map((item) => (React__default.createElement(DrawerItem, Object.assign({ key: item.id }, item)))))) : null;
};

export { Panels };
//# sourceMappingURL=Panels.js.map
