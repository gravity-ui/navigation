import React__default from 'react';

/* Used by renderContent AsideHeader prop */
const RenderContent = React__default.memo(({ renderContent, size }) => {
    return React__default.createElement(React__default.Fragment, null, renderContent({ size }));
});
RenderContent.displayName = 'RenderContent';
const Content = ({ size, // TODO: move to context when MobileHeader will support it
className, cssSizeVariableName = '--gn-aside-header-size', renderContent, children, }) => {
    return (React__default.createElement("div", { className: className, style: Object.assign({}, { [cssSizeVariableName]: `${size}px` }) }, typeof renderContent === 'function' ? (React__default.createElement(RenderContent, { size: size, renderContent: renderContent })) : (children)));
};

export { Content };
//# sourceMappingURL=Content.js.map
