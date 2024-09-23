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

export { flattenHotkeyGroups };
//# sourceMappingURL=index.es57.js.map
