import React__default, { useRef } from 'react';
import { setRef } from '@gravity-ui/uikit';
import '../../AllPagesPanel/AllPagesPanel.js';
import '@gravity-ui/icons';
import '../../AllPagesPanel/i18n/index.js';
import { useVisibleMenuItems } from '../../AllPagesPanel/useVisibleMenuItems.js';
import { CompositeBar } from '../../CompositeBar/CompositeBar.js';
import { useAsideHeaderInnerContext } from '../AsideHeaderContext.js';
import i18n from '../i18n/index.js';
import { b } from '../utils.js';
import { CollapseButton } from './CollapseButton/CollapseButton.js';
import { Header } from './Header.js';
import { Panels } from './Panels.js';

const FirstPanel = React__default.forwardRef((_props, ref) => {
    const { size, onItemClick, headerDecoration, multipleTooltip, menuMoreTitle, renderFooter, compact, customBackground, customBackgroundClassName, className, hideCollapseButton, qa, } = useAsideHeaderInnerContext();
    const visibleMenuItems = useVisibleMenuItems();
    const asideRef = useRef(null);
    React__default.useEffect(() => {
        setRef(ref, asideRef.current);
    }, [ref]);
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("div", { className: b('aside', className), style: { width: size }, "data-qa": qa },
            React__default.createElement("div", { className: b('aside-popup-anchor'), ref: asideRef }),
            React__default.createElement("div", { className: b('aside-content', { ['with-decoration']: headerDecoration }) },
                customBackground && (React__default.createElement("div", { className: b('aside-custom-background', customBackgroundClassName) }, customBackground)),
                React__default.createElement(Header, null),
                (visibleMenuItems === null || visibleMenuItems === void 0 ? void 0 : visibleMenuItems.length) ? (React__default.createElement(CompositeBar, { type: "menu", items: visibleMenuItems, menuMoreTitle: menuMoreTitle !== null && menuMoreTitle !== void 0 ? menuMoreTitle : i18n('label_more'), onItemClick: onItemClick, multipleTooltip: multipleTooltip })) : (React__default.createElement("div", { className: b('menu-items') })),
                React__default.createElement("div", { className: b('footer') }, renderFooter === null || renderFooter === void 0 ? void 0 : renderFooter({
                    size,
                    compact: Boolean(compact),
                    asideRef,
                })),
                !hideCollapseButton && React__default.createElement(CollapseButton, null))),
        React__default.createElement(Panels, null)));
});
FirstPanel.displayName = 'FirstPanel';

export { FirstPanel };
//# sourceMappingURL=FirstPanel.js.map
