'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var icons = require('@gravity-ui/icons');
var uikit = require('@gravity-ui/uikit');
var cn = require('../utils/cn.js');
var index = require('./i18n/index.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('title');
const Title = ({ children, closeIconSize = 23, hasSeparator, closeTitle = index["default"]('button_close'), onClose, }) => {
    return (React__default["default"].createElement("div", { className: b({ separator: hasSeparator }) },
        React__default["default"].createElement(uikit.Text, { className: b('text'), as: 'h3', variant: 'subheader-3' }, children),
        onClose && (React__default["default"].createElement(uikit.Button, { onClick: onClose, view: "flat", size: "l", extraProps: {
                'aria-label': closeTitle,
            } },
            React__default["default"].createElement(uikit.Icon, { data: icons.Xmark, size: closeIconSize })))));
};
Title.displayName = 'Title';

exports.Title = Title;
//# sourceMappingURL=Title.js.map
