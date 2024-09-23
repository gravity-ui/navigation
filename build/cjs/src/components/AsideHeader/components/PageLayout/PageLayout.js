'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Content = require('../../../Content/Content.js');
var constants = require('../../../constants.js');
var AsideHeaderContext = require('../../AsideHeaderContext.js');
var utils = require('../../utils.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const TopPanel = React__default["default"].lazy(() => Promise.resolve().then(function () { return require('../TopPanel.js'); }).then((module) => ({ default: module.TopPanel })));
const Layout = ({ compact, className, children, topAlert }) => {
    const size = compact ? constants.ASIDE_HEADER_COMPACT_WIDTH : constants.ASIDE_HEADER_EXPANDED_WIDTH;
    const asideHeaderContextValue = React.useMemo(() => ({ size, compact }), [compact, size]);
    return (React__default["default"].createElement(AsideHeaderContext.AsideHeaderContextProvider, { value: asideHeaderContextValue },
        React__default["default"].createElement("div", { className: utils.b({ compact }, className), style: Object.assign({}, { '--gn-aside-header-size': `${size}px` }) },
            topAlert && (React__default["default"].createElement(React.Suspense, { fallback: null },
                React__default["default"].createElement(TopPanel, { topAlert: topAlert }))),
            React__default["default"].createElement("div", { className: utils.b('pane-container') }, children))));
};
const ConnectedContent = ({ children, renderContent, }) => {
    const { size } = AsideHeaderContext.useAsideHeaderContext();
    return (React__default["default"].createElement(Content.Content, { size: size, className: utils.b('content'), renderContent: renderContent }, children));
};
const PageLayout = Object.assign(Layout, {
    Content: ConnectedContent,
});

exports.PageLayout = PageLayout;
//# sourceMappingURL=PageLayout.js.map
