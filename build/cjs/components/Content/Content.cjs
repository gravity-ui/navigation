'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');

const RenderContent = React.memo(({ renderContent, size }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(React.Fragment, { children: renderContent({ size }) });
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className,
      style: { ...{ [cssSizeVariableName]: `${size}px` } },
      children: typeof renderContent === "function" ? /* @__PURE__ */ jsxRuntime.jsx(RenderContent, { size, renderContent }) : children
    }
  );
};

exports.Content = Content;
//# sourceMappingURL=Content.cjs.map
