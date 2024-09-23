'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../node_modules/tslib/tslib.es6.mjs.js');
var React = require('react');
var Item = require('../CompositeBar/Item/Item.js');
var constants = require('../constants.js');
var cn = require('../utils/cn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('footer-item');
const FooterItem = (_a) => {
    var { item } = _a, props = tslib_es6.__rest(_a, ["item"]);
    return (React__default["default"].createElement(Item.Item, Object.assign({}, props, { item: Object.assign({ iconSize: constants.ASIDE_HEADER_ICON_SIZE }, item), className: b({ compact: props.compact }), onItemClick: item.onItemClick, onItemClickCapture: item.onItemClickCapture })));
};

exports.FooterItem = FooterItem;
//# sourceMappingURL=FooterItem.js.map
