'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var cn = require('../utils/cn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('mobile-logo');
const MobileLogo = ({ text, compact, icon, iconSrc, iconClassName, iconSize = 32, textSize = 20, href = '/', target = '_self', wrapper, onClick, className, }) => {
    const hasWrapper = typeof wrapper === 'function';
    let logoIcon;
    if (iconSrc) {
        logoIcon = (React__default["default"].createElement("img", { alt: "logo icon", src: iconSrc, width: iconSize, height: iconSize, className: iconClassName }));
    }
    else if (icon) {
        logoIcon = React__default["default"].createElement(uikit.Icon, { data: icon, size: iconSize, className: b('icon', iconClassName) });
    }
    let logoTitle;
    if (typeof text === 'function') {
        logoTitle = text();
    }
    else {
        logoTitle = (React__default["default"].createElement("span", { className: b('title'), style: { fontSize: textSize } }, text));
    }
    const logo = (React__default["default"].createElement(React__default["default"].Fragment, null,
        logoIcon,
        logoTitle));
    return hasWrapper ? (React__default["default"].createElement("div", { className: b(null, className), onClick: onClick }, wrapper(logo, compact))) : (React__default["default"].createElement("a", { href: href, target: target, ref: target === '_self' ? undefined : 'noreferrer', className: b(null, className), onClick: onClick }, logo));
};

exports.MobileLogo = MobileLogo;
//# sourceMappingURL=MobileLogo.js.map
