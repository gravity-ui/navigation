'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var constants = require('../../../constants.js');
var AsideHeaderContext = require('../../AsideHeaderContext.js');
var utils = require('../../utils.js');
var dividerCollapsed = require('../../../../../assets/icons/divider-collapsed.svg.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const AsideFallback = ({ headerDecoration, subheaderItemsCount = 0, qa }) => {
    const { compact } = AsideHeaderContext.useAsideHeaderContext();
    const widthVar = compact ? '--gn-aside-header-min-width' : '--gn-aside-header-size';
    const subheaderHeight = (1 + subheaderItemsCount) * constants.ITEM_HEIGHT;
    return (React__default["default"].createElement("div", { className: utils.b('aside'), style: { width: `var(${widthVar})` }, "data-qa": qa },
        React__default["default"].createElement("div", { className: utils.b('aside-content', { 'with-decoration': headerDecoration }) },
            React__default["default"].createElement("div", { className: utils.b('header', { 'with-decoration': headerDecoration }) },
                React__default["default"].createElement("div", { style: { height: subheaderHeight } }),
                compact ? (React__default["default"].createElement(uikit.Icon, { data: dividerCollapsed["default"], className: utils.b('header-divider'), width: constants.ASIDE_HEADER_COMPACT_WIDTH, height: constants.HEADER_DIVIDER_HEIGHT })) : null),
            React__default["default"].createElement("div", { style: { flex: 1 } }))));
};

exports.AsideFallback = AsideFallback;
//# sourceMappingURL=AsideFallback.js.map
