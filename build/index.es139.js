import { useMemo } from 'react';
import { ALL_PAGES_ID } from './index.es70.js';
import i18n from './index.es138.js';

const useGroupedMenuItems = (items) => {
  const allPagesMenuItems = useMemo(() => {
    const filteredItems = items.filter(
      (item) => item.type !== "divider" && item.id !== ALL_PAGES_ID
    );
    filteredItems.sort((a, b) => {
      if (a.type === "action") {
        return 1;
      }
      if (b.type === "action") {
        return -1;
      }
      return 0;
    });
    const groupedItems = filteredItems.reduce(
      (acc, item) => {
        const category = item.category || i18n("all-panel.menu.category.allOther");
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      },
      {}
    );
    return groupedItems;
  }, [items]);
  return allPagesMenuItems;
};

export { useGroupedMenuItems };
//# sourceMappingURL=index.es139.js.map
