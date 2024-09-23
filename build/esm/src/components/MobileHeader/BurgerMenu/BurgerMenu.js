import React__default from 'react';
import { Sheet } from '@gravity-ui/uikit';
import { block } from '../../utils/cn.js';
import { BurgerCompositeBar } from './BurgerCompositeBar/BurgerCompositeBar.js';

const b = block('mobile-header-burger-menu');
const BurgerMenu = React__default.memo(({ items = [], renderFooter, modalItem, className, onItemClick }) => {
    var _a;
    return (React__default.createElement("div", { className: b(null, className) },
        modalItem && (React__default.createElement(Sheet, { visible: modalItem.visible, id: modalItem.id, title: modalItem.title, onClose: modalItem.onClose, contentClassName: modalItem.contentClassName, className: modalItem.className }, (_a = modalItem.renderContent) === null || _a === void 0 ? void 0 : _a.call(modalItem))),
        React__default.createElement(BurgerCompositeBar, { items: items, onItemClick: onItemClick }),
        renderFooter && React__default.createElement("div", { className: b('footer') }, renderFooter === null || renderFooter === void 0 ? void 0 : renderFooter())));
});
BurgerMenu.displayName = 'BurgerMenu';

export { BurgerMenu };
//# sourceMappingURL=BurgerMenu.js.map
