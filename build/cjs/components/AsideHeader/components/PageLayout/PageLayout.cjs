'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../../node_modules/react/jsx-runtime.cjs');
const React = require('react');
const constants = require('../../../constants.cjs');
const AsideHeaderContext = require('../../AsideHeaderContext.cjs');
const utils = require('../../utils.cjs');
;/* empty css                       */
const Content = require('../../../Content/Content.cjs');

const TopPanel = React.lazy(
  () => Promise.resolve().then(() => require('../TopPanel.cjs')).then((module) => ({ default: module.TopPanel }))
);
const Layout = ({ compact, className, children, topAlert }) => {
  const size = compact ? constants.ASIDE_HEADER_COMPACT_WIDTH : constants.ASIDE_HEADER_EXPANDED_WIDTH;
  const asideHeaderContextValue = React.useMemo(() => ({ size, compact }), [compact, size]);
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(AsideHeaderContext.AsideHeaderContextProvider, { value: asideHeaderContextValue, children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(
    "div",
    {
      className: utils.b({ compact }, className),
      style: {
        ...{ "--gn-aside-header-size": `${size}px` }
      },
      children: [
        topAlert && /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(React.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(TopPanel, { topAlert }) }),
        /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: utils.b("pane-container"), children })
      ]
    }
  ) });
};
const ConnectedContent = ({
  children,
  renderContent
}) => {
  const { size } = AsideHeaderContext.useAsideHeaderContext();
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Content.Content, { size, className: utils.b("content"), renderContent, children });
};
const PageLayout = Object.assign(Layout, {
  Content: ConnectedContent
});

exports.PageLayout = PageLayout;
//# sourceMappingURL=PageLayout.cjs.map
