import React__default from 'react';
import { Icon } from '@gravity-ui/uikit';
import { ASIDE_HEADER_COMPACT_WIDTH, HEADER_DIVIDER_HEIGHT, ITEM_HEIGHT } from '../../../constants.js';
import { useAsideHeaderContext } from '../../AsideHeaderContext.js';
import { b } from '../../utils.js';
import headerDividerCollapsedIcon from '../../../../assets/icons/divider-collapsed.svg.js';

const AsideFallback = ({ headerDecoration, subheaderItemsCount = 0, qa }) => {
    const { compact } = useAsideHeaderContext();
    const widthVar = compact ? '--gn-aside-header-min-width' : '--gn-aside-header-size';
    const subheaderHeight = (1 + subheaderItemsCount) * ITEM_HEIGHT;
    return (React__default.createElement("div", { className: b('aside'), style: { width: `var(${widthVar})` }, "data-qa": qa },
        React__default.createElement("div", { className: b('aside-content', { 'with-decoration': headerDecoration }) },
            React__default.createElement("div", { className: b('header', { 'with-decoration': headerDecoration }) },
                React__default.createElement("div", { style: { height: subheaderHeight } }),
                compact ? (React__default.createElement(Icon, { data: headerDividerCollapsedIcon, className: b('header-divider'), width: ASIDE_HEADER_COMPACT_WIDTH, height: HEADER_DIVIDER_HEIGHT })) : null),
            React__default.createElement("div", { style: { flex: 1 } }))));
};

export { AsideFallback };
//# sourceMappingURL=AsideFallback.js.map
