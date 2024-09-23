'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const PageLayout = require('./components/PageLayout/PageLayout.cjs');
const PageLayoutAside = require('./components/PageLayout/PageLayoutAside.cjs');

const AsideHeader = React.forwardRef(
  ({ compact, className, topAlert, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsxs(PageLayout.PageLayout, { compact, className, topAlert, children: [
      /* @__PURE__ */ jsxRuntime.jsx(PageLayoutAside.PageLayoutAside, { ref, ...props }),
      /* @__PURE__ */ jsxRuntime.jsx(PageLayout.PageLayout.Content, { renderContent: props.renderContent })
    ] });
  }
);
AsideHeader.displayName = "AsideHeader";

exports.AsideHeader = AsideHeader;
//# sourceMappingURL=AsideHeader.cjs.map
