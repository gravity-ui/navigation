'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../node_modules/react/jsx-runtime.cjs');
const index = require('../../node_modules/react/index.cjs');

const RenderContent = index.default.memo(({ renderContent, size }) => {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(index.default.Fragment, { children: renderContent({ size }) });
});
RenderContent.displayName = "RenderContent";
const Content = ({
  size,
  // TODO: move to context when MobileHeader will support it
  className,
  cssSizeVariableName = "--gn-aside-header-size",
  renderContent,
  children
}) => {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
    "div",
    {
      className,
      style: { ...{ [cssSizeVariableName]: `${size}px` } },
      children: typeof renderContent === "function" ? /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(RenderContent, { size, renderContent }) : children
    }
  );
};

exports.Content = Content;
//# sourceMappingURL=Content.cjs.map
