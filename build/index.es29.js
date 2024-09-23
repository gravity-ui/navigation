import { jsx } from 'react/jsx-runtime';
import React__default from 'react';

const RenderContent = React__default.memo(({ renderContent, size }) => {
  return /* @__PURE__ */ jsx(React__default.Fragment, { children: renderContent({ size }) });
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
  return /* @__PURE__ */ jsx(
    "div",
    {
      className,
      style: { ...{ [cssSizeVariableName]: `${size}px` } },
      children: typeof renderContent === "function" ? /* @__PURE__ */ jsx(RenderContent, { size, renderContent }) : children
    }
  );
};

export { Content };
//# sourceMappingURL=index.es29.js.map
