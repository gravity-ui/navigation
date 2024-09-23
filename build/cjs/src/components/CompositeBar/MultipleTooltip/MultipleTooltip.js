'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var cn = require('../../utils/cn.js');
var constants = require('../constants.js');
var MultipleTooltipContext = require('./MultipleTooltipContext.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('multiple-tooltip');
const POPUP_OFFSET = [-32, 4];
const POPUP_MODIFIERS = [
    {
        name: 'preventOverflow',
        enabled: false,
    },
];
const MultipleTooltip = ({ items, open, anchorRef, placement, }) => {
    const { activeIndex, hideCollapseItemTooltip } = React__default["default"].useContext(MultipleTooltipContext.MultipleTooltipContext);
    const activeItem = activeIndex === undefined ? null : items[activeIndex];
    return (React__default["default"].createElement(uikit.Popup, { open: open, anchorRef: anchorRef, placement: placement, offset: POPUP_OFFSET, contentClassName: b(null), modifiers: POPUP_MODIFIERS, disableLayer: true },
        React__default["default"].createElement("div", { className: b('items-container') }, items
            .filter(({ type = 'regular', id }) => !hideCollapseItemTooltip ||
            (id !== constants.COLLAPSE_ITEM_ID && type !== 'action'))
            .map((item, idx) => {
            switch (item.type) {
                case 'divider':
                    return (React__default["default"].createElement("div", { className: b('item', { divider: true }), key: idx }, item.title));
                default:
                    return (React__default["default"].createElement("div", { className: b('item', {
                            active: item === activeItem,
                        }), key: idx }, item.title));
            }
        }))));
};

exports.MultipleTooltip = MultipleTooltip;
//# sourceMappingURL=MultipleTooltip.js.map
