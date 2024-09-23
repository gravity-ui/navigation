'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var AsideHeaderContext = require('../../AsideHeader/AsideHeaderContext.js');
var constants$1 = require('../../constants.js');
var cn = require('../../utils/cn.js');
var HighlightedItem = require('../HighlightedItem/HighlightedItem.js');
var constants = require('../constants.js');
var utils = require('../utils.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('composite-bar-item');
function renderItemTitle(item) {
    let titleNode = React__default["default"].createElement("div", { className: b('title-text') }, item.title);
    if (item.rightAdornment) {
        titleNode = (React__default["default"].createElement(React__default["default"].Fragment, null,
            titleNode,
            React__default["default"].createElement("div", { className: b('title-adornment') }, item.rightAdornment)));
    }
    return titleNode;
}
const defaultPopupPlacement = ['right-end'];
const defaultPopupOffset = [-20, 8];
const Item = (props) => {
    const { item, className, collapseItems, onMouseLeave, onMouseEnter, enableTooltip = true, popupVisible = false, popupAnchor, popupPlacement = defaultPopupPlacement, popupOffset = defaultPopupOffset, popupKeepMounted, popupContentClassName, renderPopupContent, onClosePopup, onItemClick, onItemClickCapture, bringForward, } = props;
    const { compact } = AsideHeaderContext.useAsideHeaderContext();
    const [open, toggleOpen] = React__default["default"].useState(false);
    const ref = React__default["default"].useRef(null);
    const anchorRef = popupAnchor || ref;
    const highlightedRef = React__default["default"].useRef(null);
    const type = item.type || constants.ITEM_TYPE_REGULAR;
    const current = item.current || false;
    const tooltipText = item.tooltipText || item.title;
    const icon = item.icon;
    const iconSize = item.iconSize || constants$1.ASIDE_HEADER_ICON_SIZE;
    const iconQa = item.iconQa;
    const collapsedItem = item.id === constants.COLLAPSE_ITEM_ID;
    const modifiers = React__default["default"].useMemo(() => [
        {
            name: 'compact',
            enabled: true,
            options: { compact },
            phase: 'main',
            fn() { },
        },
    ], [compact]);
    const onClose = React__default["default"].useCallback((event) => {
        var _a;
        if (event instanceof MouseEvent &&
            event.target &&
            ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.contains(event.target))) {
            return;
        }
        onClosePopup === null || onClosePopup === void 0 ? void 0 : onClosePopup();
    }, [onClosePopup]);
    if (item.type === 'divider') {
        return React__default["default"].createElement("div", { className: b('menu-divider') });
    }
    const makeIconNode = (iconEl) => {
        return compact ? (React__default["default"].createElement(uikit.ActionTooltip, { title: "", description: tooltipText, disabled: !enableTooltip || (collapsedItem && open) || popupVisible, placement: "right", className: b('icon-tooltip', { 'item-type': type }) },
            React__default["default"].createElement("div", { onMouseEnter: () => onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter(), onMouseLeave: () => onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave(), className: b('btn-icon') }, iconEl))) : (iconEl);
    };
    const makeNode = ({ icon: iconEl, title: titleEl }) => {
        const createdNode = (React__default["default"].createElement(React__default["default"].Fragment, null,
            React__default["default"].createElement("div", { className: b({ type, current, compact }, className), ref: ref, "data-qa": item.qa, onClick: (event) => {
                    if (collapsedItem) {
                        /**
                         * If we call onItemClick for collapsedItem then:
                         * - User get unexpected item in onItemClick callback
                         * - onClosePanel calls twice for each popuped item, as result it will prevent opening of panelItems
                         */
                        toggleOpen(!open);
                    }
                    else {
                        onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(item, false, event);
                    }
                }, onClickCapture: onItemClickCapture, onMouseEnter: () => {
                    if (!compact) {
                        onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter();
                    }
                }, onMouseLeave: () => {
                    if (!compact) {
                        onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave();
                    }
                } },
                React__default["default"].createElement("div", { className: b('icon-place'), ref: highlightedRef }, makeIconNode(iconEl)),
                React__default["default"].createElement("div", { className: b('title'), title: typeof item.title === 'string' ? item.title : undefined }, titleEl)),
            renderPopupContent && Boolean(anchorRef === null || anchorRef === void 0 ? void 0 : anchorRef.current) && (React__default["default"].createElement(uikit.Popup, { contentClassName: b('popup', popupContentClassName), open: popupVisible, keepMounted: popupKeepMounted, placement: popupPlacement, offset: popupOffset, anchorRef: anchorRef, onClose: onClose, modifiers: modifiers }, renderPopupContent()))));
        return item.link ? (React__default["default"].createElement("a", { href: item.link, className: b('link') }, createdNode)) : (createdNode);
    };
    const iconNode = icon ? (React__default["default"].createElement(uikit.Icon, { qa: iconQa, data: icon, size: iconSize, className: b('icon') })) : null;
    const titleNode = renderItemTitle(item);
    const params = { icon: iconNode, title: titleNode };
    let highlightedNode = null;
    let node;
    const opts = { compact: Boolean(compact), collapsed: false, item, ref };
    if (typeof item.itemWrapper === 'function') {
        node = item.itemWrapper(params, makeNode, opts);
        highlightedNode =
            bringForward &&
                item.itemWrapper(params, ({ icon: iconEl }) => makeIconNode(iconEl), opts);
    }
    else {
        node = makeNode(params);
        highlightedNode = bringForward && makeIconNode(iconNode);
    }
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        bringForward && (React__default["default"].createElement(HighlightedItem.HighlightedItem, { iconNode: highlightedNode, iconRef: highlightedRef, onClick: (event) => onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(item, false, event), onClickCapture: onItemClickCapture })),
        node,
        open && collapsedItem && (collapseItems === null || collapseItems === void 0 ? void 0 : collapseItems.length) && Boolean(anchorRef === null || anchorRef === void 0 ? void 0 : anchorRef.current) && (React__default["default"].createElement(CollapsedPopup, Object.assign({}, props, { anchorRef: ref, onClose: () => toggleOpen(false) })))));
};
Item.displayName = 'Item';
function CollapsedPopup({ onItemClick, collapseItems, anchorRef, onClose, }) {
    const { compact } = AsideHeaderContext.useAsideHeaderContext();
    return (collapseItems === null || collapseItems === void 0 ? void 0 : collapseItems.length) ? (React__default["default"].createElement(uikit.Popup, { placement: constants.POPUP_PLACEMENT, open: true, anchorRef: anchorRef, onClose: onClose },
        React__default["default"].createElement("div", { className: b('collapse-items-popup-content') },
            React__default["default"].createElement(uikit.List, { itemClassName: b('root-collapse-item'), items: collapseItems, selectedItemIndex: utils.getSelectedItemIndex(collapseItems), itemHeight: constants.POPUP_ITEM_HEIGHT, itemsHeight: collapseItems.length * constants.POPUP_ITEM_HEIGHT, virtualized: false, filterable: false, sortable: false, onItemClick: onClose, renderItem: (collapseItem) => {
                    const makeCollapseNode = ({ title: titleEl, icon: iconEl, }) => {
                        const res = (React__default["default"].createElement("div", { className: b('collapse-item'), onClick: (event) => {
                                onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(collapseItem, true, event);
                            } },
                            iconEl,
                            titleEl));
                        return collapseItem.link ? (React__default["default"].createElement("a", { href: collapseItem.link, className: b('link') }, res)) : (res);
                    };
                    const titleNode = renderItemTitle(collapseItem);
                    const iconNode = collapseItem.icon && (React__default["default"].createElement(uikit.Icon, { data: collapseItem.icon, size: 14, className: b('collapse-item-icon') }));
                    const params = { title: titleNode, icon: iconNode };
                    const opts = {
                        compact: Boolean(compact),
                        collapsed: true,
                        item: collapseItem,
                        ref: anchorRef,
                    };
                    if (typeof collapseItem.itemWrapper === 'function') {
                        return collapseItem.itemWrapper(params, makeCollapseNode, opts);
                    }
                    else {
                        return makeCollapseNode(params);
                    }
                } })))) : null;
}

exports.Item = Item;
exports.defaultPopupOffset = defaultPopupOffset;
exports.defaultPopupPlacement = defaultPopupPlacement;
//# sourceMappingURL=Item.js.map
