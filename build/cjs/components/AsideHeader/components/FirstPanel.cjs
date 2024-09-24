'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../node_modules/react/index.cjs');
const CompositeBar = require('../../CompositeBar/CompositeBar.cjs');
const AsideHeaderContext = require('../AsideHeaderContext.cjs');
const index$1 = require('../i18n/index.cjs');
const utils = require('../utils.cjs');
const CollapseButton = require('./CollapseButton/CollapseButton.cjs');
const Header = require('./Header.cjs');
const Panels = require('./Panels.cjs');
const useVisibleMenuItems = require('../../AllPagesPanel/useVisibleMenuItems.cjs');
const setRef = require('../../../node_modules/@gravity-ui/uikit/build/esm/hooks/useForkRef/setRef.cjs');

const FirstPanel = index.default.forwardRef((_props, ref) => {
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
  const asideRef = index.reactExports.useRef(null);
  index.default.useEffect(() => {
    setRef.setRef(ref, asideRef.current);
  }, [ref]);
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(index.default.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: utils.b("aside", className), style: { width: size }, "data-qa": qa, children: [
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: utils.b("aside-popup-anchor"), ref: asideRef }),
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs("div", { className: utils.b("aside-content", { ["with-decoration"]: headerDecoration }), children: [
        customBackground && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: utils.b("aside-custom-background", customBackgroundClassName), children: customBackground }),
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Header.Header, {}),
        visibleMenuItems?.length ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
          CompositeBar.CompositeBar,
          {
            type: "menu",
            items: visibleMenuItems,
            menuMoreTitle: menuMoreTitle ?? index$1.default("label_more"),
            onItemClick,
            multipleTooltip
          }
        ) : /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: utils.b("menu-items") }),
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: utils.b("footer"), children: renderFooter?.({
          size,
          compact: Boolean(compact),
          asideRef
        }) }),
        !hideCollapseButton && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(CollapseButton.CollapseButton, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Panels.Panels, {})
  ] });
});
FirstPanel.displayName = "FirstPanel";

exports.FirstPanel = FirstPanel;
//# sourceMappingURL=FirstPanel.cjs.map
