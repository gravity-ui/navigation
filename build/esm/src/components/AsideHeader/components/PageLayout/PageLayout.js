import React__default, { useMemo, Suspense } from 'react';
import { Content } from '../../../Content/Content.js';
import { ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH } from '../../../constants.js';
import { AsideHeaderContextProvider, useAsideHeaderContext } from '../../AsideHeaderContext.js';
import { b } from '../../utils.js';

const TopPanel = React__default.lazy(() => import('../TopPanel.js').then((module) => ({ default: module.TopPanel })));
const Layout = ({ compact, className, children, topAlert }) => {
    const size = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;
    const asideHeaderContextValue = useMemo(() => ({ size, compact }), [compact, size]);
    return (React__default.createElement(AsideHeaderContextProvider, { value: asideHeaderContextValue },
        React__default.createElement("div", { className: b({ compact }, className), style: Object.assign({}, { '--gn-aside-header-size': `${size}px` }) },
            topAlert && (React__default.createElement(Suspense, { fallback: null },
                React__default.createElement(TopPanel, { topAlert: topAlert }))),
            React__default.createElement("div", { className: b('pane-container') }, children))));
};
const ConnectedContent = ({ children, renderContent, }) => {
    const { size } = useAsideHeaderContext();
    return (React__default.createElement(Content, { size: size, className: b('content'), renderContent: renderContent }, children));
};
const PageLayout = Object.assign(Layout, {
    Content: ConnectedContent,
});

export { PageLayout };
//# sourceMappingURL=PageLayout.js.map
