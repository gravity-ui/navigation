'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../node_modules/react/jsx-runtime.cjs');
const index = require('../../node_modules/react/index.cjs');
const PageLayout = require('./components/PageLayout/PageLayout.cjs');
const PageLayoutAside = require('./components/PageLayout/PageLayoutAside.cjs');

const AsideHeader = index.default.forwardRef(
  ({ compact, className, topAlert, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsxs(PageLayout.PageLayout, { compact, className, topAlert, children: [
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(PageLayoutAside.PageLayoutAside, { ref, ...props }),
      /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(PageLayout.PageLayout.Content, { renderContent: props.renderContent })
    ] });
  }
);
AsideHeader.displayName = "AsideHeader";

exports.AsideHeader = AsideHeader;
//# sourceMappingURL=AsideHeader.cjs.map
