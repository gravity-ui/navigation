'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
require('../../AllPagesPanel/AllPagesPanel.js');
require('@gravity-ui/icons');
require('../../AllPagesPanel/i18n/index.js');
var useVisibleMenuItems = require('../../AllPagesPanel/useVisibleMenuItems.js');
var CompositeBar = require('../../CompositeBar/CompositeBar.js');
var AsideHeaderContext = require('../AsideHeaderContext.js');
var index = require('../i18n/index.js');
var utils = require('../utils.js');
var CollapseButton = require('./CollapseButton/CollapseButton.js');
var Header = require('./Header.js');
var Panels = require('./Panels.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const FirstPanel = React__default["default"].forwardRef((_props, ref) => {
    const { size, onItemClick, headerDecoration, multipleTooltip, menuMoreTitle, renderFooter, compact, customBackground, customBackgroundClassName, className, hideCollapseButton, qa, } = AsideHeaderContext.useAsideHeaderInnerContext();
    const visibleMenuItems = useVisibleMenuItems.useVisibleMenuItems();
    const asideRef = React.useRef(null);
    React__default["default"].useEffect(() => {
        uikit.setRef(ref, asideRef.current);
    }, [ref]);
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement("div", { className: utils.b('aside', className), style: { width: size }, "data-qa": qa },
            React__default["default"].createElement("div", { className: utils.b('aside-popup-anchor'), ref: asideRef }),
            React__default["default"].createElement("div", { className: utils.b('aside-content', { ['with-decoration']: headerDecoration }) },
                customBackground && (React__default["default"].createElement("div", { className: utils.b('aside-custom-background', customBackgroundClassName) }, customBackground)),
                React__default["default"].createElement(Header.Header, null),
                (visibleMenuItems === null || visibleMenuItems === void 0 ? void 0 : visibleMenuItems.length) ? (React__default["default"].createElement(CompositeBar.CompositeBar, { type: "menu", items: visibleMenuItems, menuMoreTitle: menuMoreTitle !== null && menuMoreTitle !== void 0 ? menuMoreTitle : index["default"]('label_more'), onItemClick: onItemClick, multipleTooltip: multipleTooltip })) : (React__default["default"].createElement("div", { className: utils.b('menu-items') })),
                React__default["default"].createElement("div", { className: utils.b('footer') }, renderFooter === null || renderFooter === void 0 ? void 0 : renderFooter({
                    size,
                    compact: Boolean(compact),
                    asideRef,
                })),
                !hideCollapseButton && React__default["default"].createElement(CollapseButton.CollapseButton, null))),
        React__default["default"].createElement(Panels.Panels, null)));
});
FirstPanel.displayName = 'FirstPanel';

exports.FirstPanel = FirstPanel;
//# sourceMappingURL=FirstPanel.js.map
