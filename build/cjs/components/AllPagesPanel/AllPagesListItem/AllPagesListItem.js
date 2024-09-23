'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var icons = require('@gravity-ui/icons');
var uikit = require('@gravity-ui/uikit');
var cn = require('../../utils/cn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('all-pages-list-item');
const AllPagesListItem = (props) => {
    const { item, editMode, onToggle } = props;
    const onPinButtonClick = React.useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        onToggle();
    }, [onToggle]);
    const onItemClick = (e) => {
        if (editMode) {
            e.stopPropagation();
            e.preventDefault();
        }
    };
    return (React__default["default"].createElement("div", { className: b(), onClick: onItemClick },
        item.icon ? (React__default["default"].createElement(uikit.Icon, { className: b('icon'), data: item.icon, size: item.iconSize })) : null,
        React__default["default"].createElement("span", { className: b('text') }, item.title),
        editMode && (React__default["default"].createElement(uikit.Button, { onClick: onPinButtonClick, view: item.hidden ? 'flat-secondary' : 'flat-action' },
            React__default["default"].createElement(uikit.Button.Icon, null, item.hidden ? React__default["default"].createElement(icons.Pin, null) : React__default["default"].createElement(icons.PinFill, null))))));
};

exports.AllPagesListItem = AllPagesListItem;
//# sourceMappingURL=AllPagesListItem.js.map
