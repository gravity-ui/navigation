import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import React__default from 'react';
import { Sheet } from '@gravity-ui/uikit';
import { block } from '../../utils/cn.mjs';
import { BurgerCompositeBar } from './BurgerCompositeBar/BurgerCompositeBar.mjs';
/* empty css                 */

const b = block("mobile-header-burger-menu");
const BurgerMenu = React__default.memo(
  ({ items = [], renderFooter, modalItem, className, onItemClick }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: b(null, className), children: [
      modalItem && /* @__PURE__ */ jsxRuntimeExports.jsx(
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(BurgerCompositeBar, { items, onItemClick }),
      renderFooter && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b("footer"), children: renderFooter?.() })
    ] });
  }
);
BurgerMenu.displayName = "BurgerMenu";

export { BurgerMenu };
//# sourceMappingURL=BurgerMenu.mjs.map
