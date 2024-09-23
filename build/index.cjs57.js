'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

function flattenHotkeyGroups(hotkeys) {
  const result = [];
  for (const hotkeysGroup of hotkeys) {
    result.push({
      title: hotkeysGroup.title,
      group: true
    });
    result.push(...hotkeysGroup.items);
  }
  return result;
}

exports.flattenHotkeyGroups = flattenHotkeyGroups;
//# sourceMappingURL=index.cjs57.js.map
