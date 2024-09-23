'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var FirstPanel = require('../FirstPanel.js');
require('@gravity-ui/uikit');
require('../../../../../node_modules/lodash/_root.js');
require('../../../../../node_modules/lodash/_baseGetTag.js');
require('../../utils.js');
var AsideHeaderContext = require('../../AsideHeaderContext.js');
var useAsideHeaderInnerContextValue = require('../../useAsideHeaderInnerContextValue.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const PageLayoutAside = React__default["default"].forwardRef((props, ref) => {
    const { size, compact } = AsideHeaderContext.useAsideHeaderContext();
    const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue.useAsideHeaderInnerContextValue(Object.assign({ size, compact }, props));
    return (React__default["default"].createElement(AsideHeaderContext.AsideHeaderInnerContextProvider, { value: asideHeaderInnerContextValue },
        React__default["default"].createElement(FirstPanel.FirstPanel, { ref: ref })));
});
PageLayoutAside.displayName = 'PageLayoutAside';

exports.PageLayoutAside = PageLayoutAside;
//# sourceMappingURL=PageLayoutAside.js.map
