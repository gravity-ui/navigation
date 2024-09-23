'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const CompositeBar = require('../../CompositeBar/CompositeBar.cjs');
const AsideHeaderContext = require('../AsideHeaderContext.cjs');
const index = require('../i18n/index.cjs');
const utils = require('../utils.cjs');
const CollapseButton = require('./CollapseButton/CollapseButton.cjs');
const Header = require('./Header.cjs');
const Panels = require('./Panels.cjs');
const useVisibleMenuItems = require('../../AllPagesPanel/useVisibleMenuItems.cjs');

const FirstPanel = React.forwardRef((_props, ref) => {
  const {
    size,
    onItemClick,
    headerDecoration,
    multipleTooltip,
    menuMoreTitle,
    renderFooter,
    compact,
    customBackground,
    customBackgroundClassName,
    className,
    hideCollapseButton,
    qa
  } = AsideHeaderContext.useAsideHeaderInnerContext();
  const visibleMenuItems = useVisibleMenuItems.useVisibleMenuItems();
  const asideRef = React.useRef(null);
  React.useEffect(() => {
    uikit.setRef(ref, asideRef.current);
  }, [ref]);
  return /* @__PURE__ */ jsxRuntime.jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: utils.b("aside", className), style: { width: size }, "data-qa": qa, children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: utils.b("aside-popup-anchor"), ref: asideRef }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: utils.b("aside-content", { ["with-decoration"]: headerDecoration }), children: [
        customBackground && /* @__PURE__ */ jsxRuntime.jsx("div", { className: utils.b("aside-custom-background", customBackgroundClassName), children: customBackground }),
        /* @__PURE__ */ jsxRuntime.jsx(Header.Header, {}),
        visibleMenuItems?.length ? /* @__PURE__ */ jsxRuntime.jsx(
          CompositeBar.CompositeBar,
          {
            type: "menu",
            items: visibleMenuItems,
            menuMoreTitle: menuMoreTitle ?? index.default("label_more"),
            onItemClick,
            multipleTooltip
          }
        ) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: utils.b("menu-items") }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: utils.b("footer"), children: renderFooter?.({
          size,
          compact: Boolean(compact),
          asideRef
        }) }),
        !hideCollapseButton && /* @__PURE__ */ jsxRuntime.jsx(CollapseButton.CollapseButton, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(Panels.Panels, {})
  ] });
});
FirstPanel.displayName = "FirstPanel";

exports.FirstPanel = FirstPanel;
//# sourceMappingURL=FirstPanel.cjs.map
