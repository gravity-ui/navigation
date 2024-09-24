import { j as jsxRuntimeExports } from '../../node_modules/react/jsx-runtime.mjs';
import React from '../../node_modules/react/index.mjs';

const RenderContent = React.memo(({ renderContent, size }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(React.Fragment, { children: renderContent({ size }) });
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className,
      style: { ...{ [cssSizeVariableName]: `${size}px` } },
      children: typeof renderContent === "function" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RenderContent, { size, renderContent }) : children
    }
  );
};

export { Content };
//# sourceMappingURL=Content.mjs.map
