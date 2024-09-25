import { jsxs, jsx } from 'react/jsx-runtime';
import React__default from 'react';
import { Sheet } from '@gravity-ui/uikit';
import { block } from '../../utils/cn.mjs';
import { BurgerCompositeBar } from './BurgerCompositeBar/BurgerCompositeBar.mjs';
/* empty css                 */

const b = block("mobile-header-burger-menu");
const BurgerMenu = React__default.memo(
  ({ items = [], renderFooter, modalItem, className, onItemClick }) => {
    return /* @__PURE__ */ jsxs("div", { className: b(null, className), children: [
      modalItem && /* @__PURE__ */ jsx(
        Sheet,
        {
          visible: modalItem.visible,
          id: modalItem.id,
          title: modalItem.title,
          onClose: modalItem.onClose,
          contentClassName: modalItem.contentClassName,
          className: modalItem.className,
          children: modalItem.renderContent?.()
        }
      ),
      /* @__PURE__ */ jsx(BurgerCompositeBar, { items, onItemClick }),
      renderFooter && /* @__PURE__ */ jsx("div", { className: b("footer"), children: renderFooter?.() })
    ] });
  }
);
BurgerMenu.displayName = "BurgerMenu";

export { BurgerMenu };
//# sourceMappingURL=BurgerMenu.mjs.map
