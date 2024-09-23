'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Drawer = require('../../Drawer/Drawer.js');
var AsideHeaderContext = require('../AsideHeaderContext.js');
var utils = require('../utils.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const Panels = () => {
    const { panelItems, onClosePanel, size } = AsideHeaderContext.useAsideHeaderInnerContext();
    return panelItems ? (React__default["default"].createElement(Drawer.Drawer, { className: utils.b('panels'), onVeilClick: onClosePanel, onEscape: onClosePanel, style: { left: size } }, panelItems.map((item) => (React__default["default"].createElement(Drawer.DrawerItem, Object.assign({ key: item.id }, item)))))) : null;
};

exports.Panels = Panels;
//# sourceMappingURL=Panels.js.map
