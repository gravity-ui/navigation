'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var AsideHeaderContext = require('../AsideHeader/AsideHeaderContext.js');

const useVisibleMenuItems = () => {
    const { menuItems, allPagesIsAvailable } = AsideHeaderContext.useAsideHeaderInnerContext();
    return React.useMemo(() => {
        if (!allPagesIsAvailable) {
            return menuItems;
        }
        let lastVisibleIndex = 0;
        return menuItems.filter((item, index, items) => {
            if (item.hidden) {
                return false;
            }
            if (index > 0 &&
                item.type === 'divider' &&
                (items[lastVisibleIndex].type === 'divider' || items[lastVisibleIndex].hidden)) {
                return false;
            }
            lastVisibleIndex = index;
            return true;
        });
    }, [allPagesIsAvailable, menuItems]);
};

exports.useVisibleMenuItems = useVisibleMenuItems;
//# sourceMappingURL=useVisibleMenuItems.js.map
