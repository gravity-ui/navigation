'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('../../node_modules/react/index.cjs');
const AsideHeaderContext = require('../AsideHeader/AsideHeaderContext.cjs');

const useVisibleMenuItems = () => {
  const { menuItems, allPagesIsAvailable } = AsideHeaderContext.useAsideHeaderInnerContext();
  return index.reactExports.useMemo(() => {
    if (!allPagesIsAvailable) {
      return menuItems;
    }
    let lastVisibleIndex = 0;
    return menuItems.filter((item, index, items) => {
      if (item.hidden) {
        return false;
      }
      if (index > 0 && item.type === "divider" && (items[lastVisibleIndex].type === "divider" || items[lastVisibleIndex].hidden)) {
        return false;
      }
      lastVisibleIndex = index;
      return true;
    });
  }, [allPagesIsAvailable, menuItems]);
};

exports.useVisibleMenuItems = useVisibleMenuItems;
//# sourceMappingURL=useVisibleMenuItems.cjs.map
