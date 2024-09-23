'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var cn = require('../utils/cn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('logo');
const Logo = ({ text, icon, iconSrc, iconClassName, iconSize = 24, textSize = 15, href, target = '_self', wrapper, onClick, compact, className, buttonWrapperClassName, buttonClassName, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, }) => {
    const hasWrapper = typeof wrapper === 'function';
    let buttonIcon;
    if (iconSrc) {
        buttonIcon = (React__default["default"].createElement(uikit.Button.Icon, { className: iconClassName },
            React__default["default"].createElement("img", { alt: "logo icon", src: iconSrc, width: iconSize, height: iconSize })));
    }
    else if (icon) {
        buttonIcon = React__default["default"].createElement(uikit.Icon, { data: icon, size: iconSize, className: iconClassName });
    }
    const button = (React__default["default"].createElement(uikit.Button, { view: "flat", size: "l", className: b('btn-logo', buttonClassName), component: hasWrapper ? 'span' : undefined, onClick: onClick, target: target, rel: target === '_self' ? undefined : 'noreferrer', href: href, extraProps: {
            'aria-label': ariaLabel,
            'aria-labelledby': ariaLabelledby,
        } }, buttonIcon));
    let logo;
    if (typeof text === 'function') {
        logo = text();
    }
    else {
        logo = (React__default["default"].createElement("div", { className: b('logo'), style: { fontSize: textSize } }, text));
    }
    return (React__default["default"].createElement("div", { className: b(null, className) },
        React__default["default"].createElement("div", { className: b('logo-btn-place', buttonWrapperClassName) }, hasWrapper ? wrapper(button, Boolean(compact)) : button),
        !compact &&
            (hasWrapper ? (React__default["default"].createElement("div", { onClick: onClick }, wrapper(logo, Boolean(compact)))) : (React__default["default"].createElement("a", { href: href !== null && href !== void 0 ? href : '/', target: target, rel: target === '_self' ? undefined : 'noreferrer', className: b('logo-link'), onClick: onClick }, logo)))));
};

exports.Logo = Logo;
//# sourceMappingURL=Logo.js.map
