'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var uikit = require('@gravity-ui/uikit');
var reactVirtualizedAutoSizer_esm = require('../../../node_modules/react-virtualized-auto-sizer/dist/react-virtualized-auto-sizer.esm.js');
var AsideHeaderContext = require('../AsideHeader/AsideHeaderContext.js');
var constants = require('../constants.js');
var cn = require('../utils/cn.js');
var Item = require('./Item/Item.js');
var MultipleTooltip = require('./MultipleTooltip/MultipleTooltip.js');
var MultipleTooltipContext = require('./MultipleTooltip/MultipleTooltipContext.js');
var constants$1 = require('./constants.js');
var utils = require('./utils.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const b = cn.block('composite-bar');
const CompositeBarView = ({ type, items, onItemClick, collapseItems, multipleTooltip = false, }) => {
    const ref = React.useRef(null);
    const tooltipRef = React.useRef(null);
    const { setValue: setMultipleTooltipContextValue, active: multipleTooltipActive, activeIndex, lastClickedItemIndex, } = React.useContext(MultipleTooltipContext.MultipleTooltipContext);
    const { compact } = AsideHeaderContext.useAsideHeaderContext();
    React__default["default"].useEffect(() => {
        function handleBlurWindow() {
            if (multipleTooltip && multipleTooltipActive) {
                setMultipleTooltipContextValue({ active: false });
            }
        }
        window.addEventListener('blur', handleBlurWindow);
        return () => {
            window.removeEventListener('blur', handleBlurWindow);
        };
    }, [multipleTooltip, multipleTooltipActive, setMultipleTooltipContextValue]);
    const onTooltipMouseEnter = React.useCallback((e) => {
        if (multipleTooltip &&
            compact &&
            !multipleTooltipActive &&
            document.hasFocus() &&
            activeIndex !== lastClickedItemIndex &&
            e.clientX <= constants.ASIDE_HEADER_COMPACT_WIDTH) {
            setMultipleTooltipContextValue === null || setMultipleTooltipContextValue === void 0 ? void 0 : setMultipleTooltipContextValue({
                active: true,
            });
        }
    }, [
        multipleTooltip,
        compact,
        multipleTooltipActive,
        activeIndex,
        lastClickedItemIndex,
        setMultipleTooltipContextValue,
    ]);
    const onTooltipMouseLeave = React.useCallback(() => {
        if (multipleTooltip && multipleTooltipActive && document.hasFocus()) {
            setMultipleTooltipContextValue === null || setMultipleTooltipContextValue === void 0 ? void 0 : setMultipleTooltipContextValue({
                active: false,
                lastClickedItemIndex: undefined,
            });
        }
    }, [multipleTooltip, multipleTooltipActive, setMultipleTooltipContextValue]);
    const onMouseEnterByIndex = React.useCallback((itemIndex) => () => {
        if (multipleTooltip && document.hasFocus()) {
            let multipleTooltipActiveValue = multipleTooltipActive;
            if (!multipleTooltipActive && itemIndex !== lastClickedItemIndex) {
                multipleTooltipActiveValue = true;
            }
            if (activeIndex === itemIndex &&
                multipleTooltipActive === multipleTooltipActiveValue) {
                return;
            }
            setMultipleTooltipContextValue({
                activeIndex: itemIndex,
                active: multipleTooltipActiveValue,
            });
        }
    }, [
        multipleTooltip,
        multipleTooltipActive,
        lastClickedItemIndex,
        activeIndex,
        setMultipleTooltipContextValue,
    ]);
    const onMouseLeave = React.useCallback(() => {
        var _a;
        if (compact && document.hasFocus()) {
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.activateItem(undefined);
            if (multipleTooltip &&
                (activeIndex !== undefined || lastClickedItemIndex !== undefined)) {
                setMultipleTooltipContextValue({
                    activeIndex: undefined,
                    lastClickedItemIndex: undefined,
                });
            }
        }
    }, [
        activeIndex,
        compact,
        lastClickedItemIndex,
        multipleTooltip,
        setMultipleTooltipContextValue,
    ]);
    const onItemClickByIndex = React.useCallback((itemIndex) => (item, collapsed, event) => {
        if (compact &&
            multipleTooltip &&
            itemIndex !== lastClickedItemIndex &&
            item.id !== constants$1.COLLAPSE_ITEM_ID) {
            setMultipleTooltipContextValue({
                lastClickedItemIndex: itemIndex,
                active: false,
            });
        }
        onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(item, collapsed, event);
    }, [
        compact,
        lastClickedItemIndex,
        multipleTooltip,
        onItemClick,
        setMultipleTooltipContextValue,
    ]);
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement("div", { ref: tooltipRef, onMouseEnter: onTooltipMouseEnter, onMouseLeave: onTooltipMouseLeave },
            React__default["default"].createElement(uikit.List, { ref: ref, items: items, selectedItemIndex: type === 'menu' ? utils.getSelectedItemIndex(items) : undefined, itemHeight: utils.getItemHeight, itemsHeight: utils.getItemsHeight, itemClassName: b('root-menu-item'), virtualized: false, filterable: false, sortable: false, renderItem: (item, _isItemActive, itemIndex) => {
                    const itemExtraProps = utils.isMenuItem(item) ? { item } : item;
                    const enableTooltip = utils.isMenuItem(item)
                        ? !multipleTooltip
                        : item.enableTooltip;
                    return (React__default["default"].createElement(Item.Item, Object.assign({}, itemExtraProps, { enableTooltip: enableTooltip, onMouseEnter: onMouseEnterByIndex(itemIndex), onMouseLeave: onMouseLeave, onItemClick: onItemClickByIndex(itemIndex), collapseItems: collapseItems })));
                } })),
        type === 'menu' && multipleTooltip && (React__default["default"].createElement(MultipleTooltip.MultipleTooltip, { open: compact && multipleTooltipActive, anchorRef: tooltipRef, placement: ['right-start'], items: items }))));
};
const CompositeBar = ({ type, items, menuMoreTitle, onItemClick, multipleTooltip = false, }) => {
    if (items.length === 0) {
        return null;
    }
    let node;
    if (type === 'menu') {
        const minHeight = utils.getItemsMinHeight(items);
        const collapseItem = utils.getMoreButtonItem(menuMoreTitle);
        node = (React__default["default"].createElement("div", { className: b({ autosizer: true }), style: { minHeight } }, items.length !== 0 && (React__default["default"].createElement(reactVirtualizedAutoSizer_esm["default"], null, (size) => {
            const width = Number.isNaN(size.width) ? 0 : size.width;
            const height = Number.isNaN(size.height) ? 0 : size.height;
            const { listItems, collapseItems } = utils.getAutosizeListItems(items, height, collapseItem);
            return (React__default["default"].createElement("div", { style: { width, height } },
                React__default["default"].createElement(CompositeBarView, { type: "menu", items: listItems, onItemClick: onItemClick, collapseItems: collapseItems, multipleTooltip: multipleTooltip })));
        }))));
    }
    else {
        node = (React__default["default"].createElement("div", { className: b({ subheader: true }) },
            React__default["default"].createElement(CompositeBarView, { type: "subheader", items: items, onItemClick: onItemClick })));
    }
    return React__default["default"].createElement(MultipleTooltipContext.MultipleTooltipProvider, null, node);
};

exports.CompositeBar = CompositeBar;
//# sourceMappingURL=CompositeBar.js.map
