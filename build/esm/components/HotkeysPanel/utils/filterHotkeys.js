function filterHotkeys(hotkeys, filter) {
    if (filter) {
        const result = [];
        const normalizedFilter = filter.toLowerCase();
        for (const hotkeysBlock of hotkeys) {
            const filteredItems = hotkeysBlock.items.filter((item) => item.title.toLowerCase().includes(normalizedFilter));
            if (filteredItems.length > 0) {
                result.push(Object.assign(Object.assign({}, hotkeysBlock), { items: filteredItems }));
            }
        }
        return result;
    }
    return hotkeys;
}

export { filterHotkeys };
//# sourceMappingURL=filterHotkeys.js.map
