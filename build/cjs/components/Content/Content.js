'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/* Used by renderContent AsideHeader prop */
const RenderContent = React__default["default"].memo(({ renderContent, size }) => {
    return React__default["default"].createElement(React__default["default"].Fragment, null, renderContent({ size }));
});
RenderContent.displayName = 'RenderContent';
const Content = ({ size, // TODO: move to context when MobileHeader will support it
className, cssSizeVariableName = '--gn-aside-header-size', renderContent, children, }) => {
    return (React__default["default"].createElement("div", { className: className, style: Object.assign({}, { [cssSizeVariableName]: `${size}px` }) }, typeof renderContent === 'function' ? (React__default["default"].createElement(RenderContent, { size: size, renderContent: renderContent })) : (children)));
};

exports.Content = Content;
//# sourceMappingURL=Content.js.map
