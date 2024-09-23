import React__default from 'react';
import { List, Icon } from '@gravity-ui/uikit';
import { block } from '../../../utils/cn.js';
import { MOBILE_HEADER_ICON_SIZE } from '../../constants.js';
import { getSelectedItemIndex, getItemHeight } from '../../utils.js';

const b = block('burger-composite-bar');
const Item = ({ item, onItemClick }) => {
    const { icon, type = 'regular', iconSize = MOBILE_HEADER_ICON_SIZE } = item;
    if (type === 'divider') {
        return React__default.createElement("div", { className: b('menu-divider') });
    }
    const node = (React__default.createElement("div", { className: b('item', { type }), onClick: () => {
            if (typeof item.onItemClick === 'function') {
                item.onItemClick(item);
            }
            if (type === 'regular') {
                onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(item);
            }
        } },
        React__default.createElement("div", { className: b('item-icon-place') }, icon && React__default.createElement(Icon, { data: icon, size: iconSize, className: b('item-icon') })),
        React__default.createElement("div", { className: b('item-title') }, item.title)));
    if (typeof item.itemWrapper === 'function') {
        return item.itemWrapper(node, item);
    }
    return item.link ? (React__default.createElement("a", { href: item.link, className: b('link') }, node)) : (node);
};
Item.displayName = 'Item';
const BurgerCompositeBar = React__default.memo(({ items, onItemClick }) => {
    return (React__default.createElement("nav", { className: b() },
        React__default.createElement(List, { items: items, selectedItemIndex: getSelectedItemIndex(items), itemHeight: getItemHeight, itemClassName: b('root-menu-item'), virtualized: false, filterable: false, sortable: false, renderItem: (item) => React__default.createElement(Item, { item: item, onItemClick: onItemClick }) })));
});
BurgerCompositeBar.displayName = 'BurgerCompositeBar';

export { BurgerCompositeBar };
//# sourceMappingURL=BurgerCompositeBar.js.map
