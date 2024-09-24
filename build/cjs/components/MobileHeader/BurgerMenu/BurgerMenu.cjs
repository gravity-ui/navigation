'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../node_modules/react/index.cjs');
const cn = require('../../utils/cn.cjs');
const BurgerCompositeBar = require('./BurgerCompositeBar/BurgerCompositeBar.cjs');
;/* empty css                  */
const Sheet = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/Sheet/Sheet.cjs');

const b = cn.block("mobile-header-burger-menu");
const BurgerMenu = index.default.memo(
  ({ items = [], renderFooter, modalItem, className, onItemClick }) => {
    return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: b(null, className), children: [
      modalItem && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
        Sheet.Sheet,
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
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(BurgerCompositeBar.BurgerCompositeBar, { items, onItemClick }),
      renderFooter && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b("footer"), children: renderFooter?.() })
    ] });
  }
);
BurgerMenu.displayName = "BurgerMenu";

exports.BurgerMenu = BurgerMenu;
//# sourceMappingURL=BurgerMenu.cjs.map
