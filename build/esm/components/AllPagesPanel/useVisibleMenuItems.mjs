import { r as reactExports } from '../../node_modules/react/index.mjs';
import { useAsideHeaderInnerContext } from '../AsideHeader/AsideHeaderContext.mjs';

const useVisibleMenuItems = () => {
  const { menuItems, allPagesIsAvailable } = useAsideHeaderInnerContext();
  return reactExports.useMemo(() => {
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

export { useVisibleMenuItems };
//# sourceMappingURL=useVisibleMenuItems.mjs.map
