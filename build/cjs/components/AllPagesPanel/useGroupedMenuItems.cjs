'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('../../node_modules/react/index.cjs');
const constants = require('./constants.cjs');
const index$1 = require('./i18n/index.cjs');

const useGroupedMenuItems = (items) => {
  const allPagesMenuItems = index.reactExports.useMemo(() => {
    const filteredItems = items.filter(
      (item) => item.type !== "divider" && item.id !== constants.ALL_PAGES_ID
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
        const category = item.category || index$1.default("all-panel.menu.category.allOther");
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

exports.useGroupedMenuItems = useGroupedMenuItems;
//# sourceMappingURL=useGroupedMenuItems.cjs.map
