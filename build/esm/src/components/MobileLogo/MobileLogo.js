import React__default from 'react';
import { Icon } from '@gravity-ui/uikit';
import { block } from '../utils/cn.js';

const b = block('mobile-logo');
const MobileLogo = ({ text, compact, icon, iconSrc, iconClassName, iconSize = 32, textSize = 20, href = '/', target = '_self', wrapper, onClick, className, }) => {
    const hasWrapper = typeof wrapper === 'function';
    let logoIcon;
    if (iconSrc) {
        logoIcon = (React__default.createElement("img", { alt: "logo icon", src: iconSrc, width: iconSize, height: iconSize, className: iconClassName }));
    }
    else if (icon) {
        logoIcon = React__default.createElement(Icon, { data: icon, size: iconSize, className: b('icon', iconClassName) });
    }
    let logoTitle;
    if (typeof text === 'function') {
        logoTitle = text();
    }
    else {
        logoTitle = (React__default.createElement("span", { className: b('title'), style: { fontSize: textSize } }, text));
    }
    const logo = (React__default.createElement(React__default.Fragment, null,
        logoIcon,
        logoTitle));
    return hasWrapper ? (React__default.createElement("div", { className: b(null, className), onClick: onClick }, wrapper(logo, compact))) : (React__default.createElement("a", { href: href, target: target, ref: target === '_self' ? undefined : 'noreferrer', className: b(null, className), onClick: onClick }, logo));
};

export { MobileLogo };
//# sourceMappingURL=MobileLogo.js.map
