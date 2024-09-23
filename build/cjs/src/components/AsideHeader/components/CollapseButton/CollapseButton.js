'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var cn = require('../../../utils/cn.js');
var AsideHeaderContext = require('../../AsideHeaderContext.js');
var index = require('../../i18n/index.js');
var controlMenuButton = require('../../../../../assets/icons/control-menu-button.svg.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('collapse-button');
const CollapseButton = ({ className }) => {
    const { onChangeCompact, compact, expandTitle, collapseTitle } = AsideHeaderContext.useAsideHeaderInnerContext();
    const onCollapseButtonClick = React.useCallback(() => {
        onChangeCompact === null || onChangeCompact === void 0 ? void 0 : onChangeCompact(!compact);
    }, [compact, onChangeCompact]);
    const buttonTitle = compact
        ? expandTitle || index["default"]('button_expand')
        : collapseTitle || index["default"]('button_collapse');
    return (React__default["default"].createElement("button", { className: b({ compact }, className), onClick: onCollapseButtonClick, title: buttonTitle },
        React__default["default"].createElement(uikit.Icon, { data: controlMenuButton["default"], className: b('icon'), width: "16", height: "10" })));
};

exports.CollapseButton = CollapseButton;
//# sourceMappingURL=CollapseButton.js.map
