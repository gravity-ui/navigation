'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../node_modules/tslib/tslib.es6.js');
var React = require('react');
var PageLayout = require('./components/PageLayout/PageLayout.js');
var PageLayoutAside = require('./components/PageLayout/PageLayoutAside.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const AsideHeader = React__default["default"].forwardRef((_a, ref) => {
    var { compact, className, topAlert } = _a, props = tslib_es6.__rest(_a, ["compact", "className", "topAlert"]);
    return (React__default["default"].createElement(PageLayout.PageLayout, { compact: compact, className: className, topAlert: topAlert },
        React__default["default"].createElement(PageLayoutAside.PageLayoutAside, Object.assign({ ref: ref }, props)),
        React__default["default"].createElement(PageLayout.PageLayout.Content, { renderContent: props.renderContent })));
});
AsideHeader.displayName = 'AsideHeader';

exports.AsideHeader = AsideHeader;
//# sourceMappingURL=AsideHeader.js.map
