'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const CompositeBar = require('./index.cjs102.js');
const AsideHeaderContext = require('./index.cjs3.js');
const index = require('./index.cjs103.js');
const utils = require('./index.cjs27.js');
const CollapseButton = require('./index.cjs104.js');
const Header = require('./index.cjs105.js');
const Panels = require('./index.cjs106.js');
const useVisibleMenuItems = require('./index.cjs107.js');

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
//# sourceMappingURL=index.cjs31.js.map
