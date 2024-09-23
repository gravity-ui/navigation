import { __rest } from '../../../node_modules/tslib/tslib.es6.js';
import React__default from 'react';
import { Item } from '../CompositeBar/Item/Item.js';
import { ASIDE_HEADER_ICON_SIZE } from '../constants.js';
import { block } from '../utils/cn.js';

const b = block('footer-item');
const FooterItem = (_a) => {
    var { item } = _a, props = __rest(_a, ["item"]);
    return (React__default.createElement(Item, Object.assign({}, props, { item: Object.assign({ iconSize: ASIDE_HEADER_ICON_SIZE }, item), className: b({ compact: props.compact }), onItemClick: item.onItemClick, onItemClickCapture: item.onItemClickCapture })));
};

export { FooterItem };
//# sourceMappingURL=FooterItem.js.map
