'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function flattenHotkeyGroups(hotkeys) {
    const result = [];
    for (const hotkeysGroup of hotkeys) {
        result.push({
            title: hotkeysGroup.title,
            group: true,
        });
        result.push(...hotkeysGroup.items);
    }
    return result;
}

exports.flattenHotkeyGroups = flattenHotkeyGroups;
//# sourceMappingURL=flattenHotkeyGroups.js.map
