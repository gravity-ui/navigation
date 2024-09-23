import { __rest } from '../../../node_modules/tslib/tslib.es6.js';
import React__default, { useState, useMemo, useCallback } from 'react';
import { Hotkey, TextInput, List } from '@gravity-ui/uikit';
import { Drawer, DrawerItem } from '../Drawer/Drawer.js';
import { block } from '../utils/cn.js';
import { filterHotkeys } from './utils/filterHotkeys.js';
import { flattenHotkeyGroups } from './utils/flattenHotkeyGroups.js';

const b = block('hotkeys-panel');
function HotkeysPanel(_a) {
    var { visible, onClose, leftOffset, topOffset, className, preventScrollBody, hotkeys, itemClassName, filterPlaceholder, title, emptyState } = _a, listProps = __rest(_a, ["visible", "onClose", "leftOffset", "topOffset", "className", "preventScrollBody", "hotkeys", "itemClassName", "filterPlaceholder", "title", "emptyState"]);
    const [filter, setFilter] = useState('');
    const hotkeysList = useMemo(() => {
        const filteredHotkeys = filterHotkeys(hotkeys, filter);
        return flattenHotkeyGroups(filteredHotkeys);
    }, [hotkeys, filter]);
    const renderItem = useCallback((item) => (React__default.createElement("div", { className: b('item-content', { group: item.group }), key: item.title },
        item.title,
        item.value && React__default.createElement(Hotkey, { className: b('hotkey'), value: item.value }))), []);
    const drawerItemContent = (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("h2", { className: b('title') }, title),
        React__default.createElement(TextInput, { value: filter, onUpdate: setFilter, placeholder: filterPlaceholder, autoFocus: true, className: b('search'), hasClear: true }),
        React__default.createElement(List, Object.assign({ className: b('list'), virtualized: false, filterable: false, items: hotkeysList, renderItem: renderItem, itemClassName: b('item', itemClassName), emptyPlaceholder: emptyState }, listProps))));
    return (React__default.createElement(Drawer, { className: b(null, className), onVeilClick: onClose, onEscape: onClose, preventScrollBody: preventScrollBody, style: {
            left: leftOffset,
            top: topOffset,
        } },
        React__default.createElement(DrawerItem, { id: "hotkeys", visible: visible, className: b('drawer-item'), content: drawerItemContent })));
}

export { HotkeysPanel };
//# sourceMappingURL=HotkeysPanel.js.map
