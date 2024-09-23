import React__default from 'react';
import { Icon, Popup, List, ActionTooltip } from '@gravity-ui/uikit';
import { useAsideHeaderContext } from '../../AsideHeader/AsideHeaderContext.js';
import { ASIDE_HEADER_ICON_SIZE } from '../../constants.js';
import { block } from '../../utils/cn.js';
import { HighlightedItem } from '../HighlightedItem/HighlightedItem.js';
import { ITEM_TYPE_REGULAR, COLLAPSE_ITEM_ID, POPUP_PLACEMENT, POPUP_ITEM_HEIGHT } from '../constants.js';
import { getSelectedItemIndex } from '../utils.js';

const b = block('composite-bar-item');
function renderItemTitle(item) {
    let titleNode = React__default.createElement("div", { className: b('title-text') }, item.title);
    if (item.rightAdornment) {
        titleNode = (React__default.createElement(React__default.Fragment, null,
            titleNode,
            React__default.createElement("div", { className: b('title-adornment') }, item.rightAdornment)));
    }
    return titleNode;
}
const defaultPopupPlacement = ['right-end'];
const defaultPopupOffset = [-20, 8];
const Item = (props) => {
    const { item, className, collapseItems, onMouseLeave, onMouseEnter, enableTooltip = true, popupVisible = false, popupAnchor, popupPlacement = defaultPopupPlacement, popupOffset = defaultPopupOffset, popupKeepMounted, popupContentClassName, renderPopupContent, onClosePopup, onItemClick, onItemClickCapture, bringForward, } = props;
    const { compact } = useAsideHeaderContext();
    const [open, toggleOpen] = React__default.useState(false);
    const ref = React__default.useRef(null);
    const anchorRef = popupAnchor || ref;
    const highlightedRef = React__default.useRef(null);
    const type = item.type || ITEM_TYPE_REGULAR;
    const current = item.current || false;
    const tooltipText = item.tooltipText || item.title;
    const icon = item.icon;
    const iconSize = item.iconSize || ASIDE_HEADER_ICON_SIZE;
    const iconQa = item.iconQa;
    const collapsedItem = item.id === COLLAPSE_ITEM_ID;
    const modifiers = React__default.useMemo(() => [
        {
            name: 'compact',
            enabled: true,
            options: { compact },
            phase: 'main',
            fn() { },
        },
    ], [compact]);
    const onClose = React__default.useCallback((event) => {
        var _a;
        if (event instanceof MouseEvent &&
            event.target &&
            ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.contains(event.target))) {
            return;
        }
        onClosePopup === null || onClosePopup === void 0 ? void 0 : onClosePopup();
    }, [onClosePopup]);
    if (item.type === 'divider') {
        return React__default.createElement("div", { className: b('menu-divider') });
    }
    const makeIconNode = (iconEl) => {
        return compact ? (React__default.createElement(ActionTooltip, { title: "", description: tooltipText, disabled: !enableTooltip || (collapsedItem && open) || popupVisible, placement: "right", className: b('icon-tooltip', { 'item-type': type }) },
            React__default.createElement("div", { onMouseEnter: () => onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter(), onMouseLeave: () => onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave(), className: b('btn-icon') }, iconEl))) : (iconEl);
    };
    const makeNode = ({ icon: iconEl, title: titleEl }) => {
        const createdNode = (React__default.createElement(React__default.Fragment, null,
            React__default.createElement("div", { className: b({ type, current, compact }, className), ref: ref, "data-qa": item.qa, onClick: (event) => {
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
                React__default.createElement("div", { className: b('icon-place'), ref: highlightedRef }, makeIconNode(iconEl)),
                React__default.createElement("div", { className: b('title'), title: typeof item.title === 'string' ? item.title : undefined }, titleEl)),
            renderPopupContent && Boolean(anchorRef === null || anchorRef === void 0 ? void 0 : anchorRef.current) && (React__default.createElement(Popup, { contentClassName: b('popup', popupContentClassName), open: popupVisible, keepMounted: popupKeepMounted, placement: popupPlacement, offset: popupOffset, anchorRef: anchorRef, onClose: onClose, modifiers: modifiers }, renderPopupContent()))));
        return item.link ? (React__default.createElement("a", { href: item.link, className: b('link') }, createdNode)) : (createdNode);
    };
    const iconNode = icon ? (React__default.createElement(Icon, { qa: iconQa, data: icon, size: iconSize, className: b('icon') })) : null;
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
    return (React__default.createElement(React__default.Fragment, null,
        bringForward && (React__default.createElement(HighlightedItem, { iconNode: highlightedNode, iconRef: highlightedRef, onClick: (event) => onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(item, false, event), onClickCapture: onItemClickCapture })),
        node,
        open && collapsedItem && (collapseItems === null || collapseItems === void 0 ? void 0 : collapseItems.length) && Boolean(anchorRef === null || anchorRef === void 0 ? void 0 : anchorRef.current) && (React__default.createElement(CollapsedPopup, Object.assign({}, props, { anchorRef: ref, onClose: () => toggleOpen(false) })))));
};
Item.displayName = 'Item';
function CollapsedPopup({ onItemClick, collapseItems, anchorRef, onClose, }) {
    const { compact } = useAsideHeaderContext();
    return (collapseItems === null || collapseItems === void 0 ? void 0 : collapseItems.length) ? (React__default.createElement(Popup, { placement: POPUP_PLACEMENT, open: true, anchorRef: anchorRef, onClose: onClose },
        React__default.createElement("div", { className: b('collapse-items-popup-content') },
            React__default.createElement(List, { itemClassName: b('root-collapse-item'), items: collapseItems, selectedItemIndex: getSelectedItemIndex(collapseItems), itemHeight: POPUP_ITEM_HEIGHT, itemsHeight: collapseItems.length * POPUP_ITEM_HEIGHT, virtualized: false, filterable: false, sortable: false, onItemClick: onClose, renderItem: (collapseItem) => {
                    const makeCollapseNode = ({ title: titleEl, icon: iconEl, }) => {
                        const res = (React__default.createElement("div", { className: b('collapse-item'), onClick: (event) => {
                                onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(collapseItem, true, event);
                            } },
                            iconEl,
                            titleEl));
                        return collapseItem.link ? (React__default.createElement("a", { href: collapseItem.link, className: b('link') }, res)) : (res);
                    };
                    const titleNode = renderItemTitle(collapseItem);
                    const iconNode = collapseItem.icon && (React__default.createElement(Icon, { data: collapseItem.icon, size: 14, className: b('collapse-item-icon') }));
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

export { Item, defaultPopupOffset, defaultPopupPlacement };
//# sourceMappingURL=Item.js.map
