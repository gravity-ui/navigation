'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var uikit = require('@gravity-ui/uikit');
var Drawer = require('../Drawer/Drawer.js');
var cn = require('../utils/cn.js');
var filterHotkeys = require('./utils/filterHotkeys.js');
var flattenHotkeyGroups = require('./utils/flattenHotkeyGroups.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('hotkeys-panel');
function HotkeysPanel(_a) {
    var { visible, onClose, leftOffset, topOffset, className, preventScrollBody, hotkeys, itemClassName, filterPlaceholder, title, emptyState } = _a, listProps = tslib.__rest(_a, ["visible", "onClose", "leftOffset", "topOffset", "className", "preventScrollBody", "hotkeys", "itemClassName", "filterPlaceholder", "title", "emptyState"]);
    const [filter, setFilter] = React.useState('');
    const hotkeysList = React.useMemo(() => {
        const filteredHotkeys = filterHotkeys.filterHotkeys(hotkeys, filter);
        return flattenHotkeyGroups.flattenHotkeyGroups(filteredHotkeys);
    }, [hotkeys, filter]);
    const renderItem = React.useCallback((item) => (React__default["default"].createElement("div", { className: b('item-content', { group: item.group }), key: item.title },
        item.title,
        item.value && React__default["default"].createElement(uikit.Hotkey, { className: b('hotkey'), value: item.value }))), []);
    const drawerItemContent = (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement("h2", { className: b('title') }, title),
        React__default["default"].createElement(uikit.TextInput, { value: filter, onUpdate: setFilter, placeholder: filterPlaceholder, autoFocus: true, className: b('search'), hasClear: true }),
        React__default["default"].createElement(uikit.List, Object.assign({ className: b('list'), virtualized: false, filterable: false, items: hotkeysList, renderItem: renderItem, itemClassName: b('item', itemClassName), emptyPlaceholder: emptyState }, listProps))));
    return (React__default["default"].createElement(Drawer.Drawer, { className: b(null, className), onVeilClick: onClose, onEscape: onClose, preventScrollBody: preventScrollBody, style: {
            left: leftOffset,
            top: topOffset,
        } },
        React__default["default"].createElement(Drawer.DrawerItem, { id: "hotkeys", visible: visible, className: b('drawer-item'), content: drawerItemContent })));
}

exports.HotkeysPanel = HotkeysPanel;
//# sourceMappingURL=HotkeysPanel.js.map
