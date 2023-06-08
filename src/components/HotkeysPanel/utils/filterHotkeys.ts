import type {HotkeysGroup} from '..';

export function filterHotkeys<T>(hotkeys: HotkeysGroup<T>[], filter: string) {
    if (filter) {
        const result = [];
        const normalizedFilter = filter.toLowerCase();

        for (const hotkeysBlock of hotkeys) {
            const filteredItems = hotkeysBlock.items.filter((item) =>
                item.title.toLowerCase().includes(normalizedFilter),
            );
            if (filteredItems.length > 0) {
                result.push({
                    ...hotkeysBlock,
                    items: filteredItems,
                });
            }
        }

        return result;
    }

    return hotkeys;
}
