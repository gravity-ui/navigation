'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var CompositeBar = require('../../CompositeBar/CompositeBar.js');
var Logo = require('../../Logo/Logo.js');
var constants = require('../../constants.js');
var AsideHeaderContext = require('../AsideHeaderContext.js');
var utils = require('../utils.js');
var dividerCollapsed = require('../../../../assets/icons/divider-collapsed.svg.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const DEFAULT_SUBHEADER_ITEMS = [];
const Header = () => {
    const { logo, onItemClick, onClosePanel, headerDecoration, subheaderItems } = AsideHeaderContext.useAsideHeaderInnerContext();
    const { compact } = AsideHeaderContext.useAsideHeaderContext();
    const onLogoClick = React.useCallback((event) => {
        var _a;
        onClosePanel === null || onClosePanel === void 0 ? void 0 : onClosePanel();
        (_a = logo === null || logo === void 0 ? void 0 : logo.onClick) === null || _a === void 0 ? void 0 : _a.call(logo, event);
    }, [onClosePanel, logo]);
    return (React__default["default"].createElement("div", { className: utils.b('header', { ['with-decoration']: headerDecoration }) },
        logo && (React__default["default"].createElement(Logo.Logo, Object.assign({}, logo, { onClick: onLogoClick, compact: compact, buttonWrapperClassName: utils.b('logo-button-wrapper'), buttonClassName: utils.b('logo-button') }))),
        React__default["default"].createElement(CompositeBar.CompositeBar, { type: "subheader", items: subheaderItems || DEFAULT_SUBHEADER_ITEMS, onItemClick: onItemClick }),
        React__default["default"].createElement(uikit.Icon, { data: dividerCollapsed["default"], className: utils.b('header-divider'), width: constants.ASIDE_HEADER_COMPACT_WIDTH, height: constants.HEADER_DIVIDER_HEIGHT })));
};

exports.Header = Header;
//# sourceMappingURL=Header.js.map
