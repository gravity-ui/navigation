'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const cn = require('../../utils/cn.cjs');
const BurgerCompositeBar = require('./BurgerCompositeBar/BurgerCompositeBar.cjs');
;/* empty css                  */

const b = cn.block("mobile-header-burger-menu");
const BurgerMenu = React.memo(
  ({ items = [], renderFooter, modalItem, className, onItemClick }) => {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: b(null, className), children: [
      modalItem && /* @__PURE__ */ jsxRuntime.jsx(
        uikit.Sheet,
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
      /* @__PURE__ */ jsxRuntime.jsx(BurgerCompositeBar.BurgerCompositeBar, { items, onItemClick }),
      renderFooter && /* @__PURE__ */ jsxRuntime.jsx("div", { className: b("footer"), children: renderFooter?.() })
    ] });
  }
);
BurgerMenu.displayName = "BurgerMenu";

exports.BurgerMenu = BurgerMenu;
//# sourceMappingURL=BurgerMenu.cjs.map
