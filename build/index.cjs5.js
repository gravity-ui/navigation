'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const constants = require('./index.cjs23.js');
const AsideHeaderContext = require('./index.cjs3.js');
const utils = require('./index.cjs27.js');
;/* empty css             */
const Content = require('./index.cjs29.js');

const TopPanel = React.lazy(
  () => Promise.resolve().then(() => require('./index.cjs26.js')).then((module) => ({ default: module.TopPanel }))
);
const Layout = ({ compact, className, children, topAlert }) => {
  const size = compact ? constants.ASIDE_HEADER_COMPACT_WIDTH : constants.ASIDE_HEADER_EXPANDED_WIDTH;
  const asideHeaderContextValue = React.useMemo(() => ({ size, compact }), [compact, size]);
  return /* @__PURE__ */ jsxRuntime.jsx(AsideHeaderContext.AsideHeaderContextProvider, { value: asideHeaderContextValue, children: /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: utils.b({ compact }, className),
      style: {
        ...{ "--gn-aside-header-size": `${size}px` }
      },
      children: [
        topAlert && /* @__PURE__ */ jsxRuntime.jsx(React.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntime.jsx(TopPanel, { topAlert }) }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: utils.b("pane-container"), children })
      ]
    }
  ) });
};
const ConnectedContent = ({
  children,
  renderContent
}) => {
  const { size } = AsideHeaderContext.useAsideHeaderContext();
  return /* @__PURE__ */ jsxRuntime.jsx(Content.Content, { size, className: utils.b("content"), renderContent, children });
};
const PageLayout = Object.assign(Layout, {
  Content: ConnectedContent
});

exports.PageLayout = PageLayout;
//# sourceMappingURL=index.cjs5.js.map
