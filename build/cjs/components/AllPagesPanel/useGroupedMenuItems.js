'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var constants = require('./constants.js');
var index = require('./i18n/index.js');

const useGroupedMenuItems = (items) => {
    const allPagesMenuItems = React.useMemo(() => {
        const filteredItems = items.filter((item) => item.type !== 'divider' && item.id !== constants.ALL_PAGES_ID);
        filteredItems.sort((a, b) => {
            if (a.type === 'action') {
                return 1;
            }
            if (b.type === 'action') {
                return -1;
            }
            return 0;
        });
        const groupedItems = filteredItems.reduce((acc, item) => {
            const category = item.category || index["default"]('all-panel.menu.category.allOther');
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});
        return groupedItems;
    }, [items]);
    return allPagesMenuItems;
};

exports.useGroupedMenuItems = useGroupedMenuItems;
//# sourceMappingURL=useGroupedMenuItems.js.map
