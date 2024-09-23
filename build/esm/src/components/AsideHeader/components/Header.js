import React__default, { useCallback } from 'react';
import { Icon } from '@gravity-ui/uikit';
import { CompositeBar } from '../../CompositeBar/CompositeBar.js';
import { Logo } from '../../Logo/Logo.js';
import { ASIDE_HEADER_COMPACT_WIDTH, HEADER_DIVIDER_HEIGHT } from '../../constants.js';
import { useAsideHeaderInnerContext, useAsideHeaderContext } from '../AsideHeaderContext.js';
import { b } from '../utils.js';
import headerDividerCollapsedIcon from '../../../../assets/icons/divider-collapsed.svg.js';

const DEFAULT_SUBHEADER_ITEMS = [];
const Header = () => {
    const { logo, onItemClick, onClosePanel, headerDecoration, subheaderItems } = useAsideHeaderInnerContext();
    const { compact } = useAsideHeaderContext();
    const onLogoClick = useCallback((event) => {
        var _a;
        onClosePanel === null || onClosePanel === void 0 ? void 0 : onClosePanel();
        (_a = logo === null || logo === void 0 ? void 0 : logo.onClick) === null || _a === void 0 ? void 0 : _a.call(logo, event);
    }, [onClosePanel, logo]);
    return (React__default.createElement("div", { className: b('header', { ['with-decoration']: headerDecoration }) },
        logo && (React__default.createElement(Logo, Object.assign({}, logo, { onClick: onLogoClick, compact: compact, buttonWrapperClassName: b('logo-button-wrapper'), buttonClassName: b('logo-button') }))),
        React__default.createElement(CompositeBar, { type: "subheader", items: subheaderItems || DEFAULT_SUBHEADER_ITEMS, onItemClick: onItemClick }),
        React__default.createElement(Icon, { data: headerDividerCollapsedIcon, className: b('header-divider'), width: ASIDE_HEADER_COMPACT_WIDTH, height: HEADER_DIVIDER_HEIGHT })));
};

export { Header };
//# sourceMappingURL=Header.js.map
