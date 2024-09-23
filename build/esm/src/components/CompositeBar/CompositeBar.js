import React__default, { useRef, useContext, useCallback } from 'react';
import { List } from '@gravity-ui/uikit';
import AutoSizer from '../../../node_modules/react-virtualized-auto-sizer/dist/react-virtualized-auto-sizer.esm.js';
import { useAsideHeaderContext } from '../AsideHeader/AsideHeaderContext.js';
import { ASIDE_HEADER_COMPACT_WIDTH } from '../constants.js';
import { block } from '../utils/cn.js';
import { Item } from './Item/Item.js';
import { MultipleTooltip } from './MultipleTooltip/MultipleTooltip.js';
import { MultipleTooltipProvider, MultipleTooltipContext } from './MultipleTooltip/MultipleTooltipContext.js';
import { COLLAPSE_ITEM_ID } from './constants.js';
import { getItemsMinHeight, getAutosizeListItems, getSelectedItemIndex, getItemHeight, getItemsHeight, isMenuItem, getMoreButtonItem } from './utils.js';

const b = block('composite-bar');
const CompositeBarView = ({ type, items, onItemClick, collapseItems, multipleTooltip = false, }) => {
    const ref = useRef(null);
    const tooltipRef = useRef(null);
    const { setValue: setMultipleTooltipContextValue, active: multipleTooltipActive, activeIndex, lastClickedItemIndex, } = useContext(MultipleTooltipContext);
    const { compact } = useAsideHeaderContext();
    React__default.useEffect(() => {
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
    const onTooltipMouseEnter = useCallback((e) => {
        if (multipleTooltip &&
            compact &&
            !multipleTooltipActive &&
            document.hasFocus() &&
            activeIndex !== lastClickedItemIndex &&
            e.clientX <= ASIDE_HEADER_COMPACT_WIDTH) {
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
    const onTooltipMouseLeave = useCallback(() => {
        if (multipleTooltip && multipleTooltipActive && document.hasFocus()) {
            setMultipleTooltipContextValue === null || setMultipleTooltipContextValue === void 0 ? void 0 : setMultipleTooltipContextValue({
                active: false,
                lastClickedItemIndex: undefined,
            });
        }
    }, [multipleTooltip, multipleTooltipActive, setMultipleTooltipContextValue]);
    const onMouseEnterByIndex = useCallback((itemIndex) => () => {
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
    const onMouseLeave = useCallback(() => {
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
    const onItemClickByIndex = useCallback((itemIndex) => (item, collapsed, event) => {
        if (compact &&
            multipleTooltip &&
            itemIndex !== lastClickedItemIndex &&
            item.id !== COLLAPSE_ITEM_ID) {
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
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("div", { ref: tooltipRef, onMouseEnter: onTooltipMouseEnter, onMouseLeave: onTooltipMouseLeave },
            React__default.createElement(List, { ref: ref, items: items, selectedItemIndex: type === 'menu' ? getSelectedItemIndex(items) : undefined, itemHeight: getItemHeight, itemsHeight: getItemsHeight, itemClassName: b('root-menu-item'), virtualized: false, filterable: false, sortable: false, renderItem: (item, _isItemActive, itemIndex) => {
                    const itemExtraProps = isMenuItem(item) ? { item } : item;
                    const enableTooltip = isMenuItem(item)
                        ? !multipleTooltip
                        : item.enableTooltip;
                    return (React__default.createElement(Item, Object.assign({}, itemExtraProps, { enableTooltip: enableTooltip, onMouseEnter: onMouseEnterByIndex(itemIndex), onMouseLeave: onMouseLeave, onItemClick: onItemClickByIndex(itemIndex), collapseItems: collapseItems })));
                } })),
        type === 'menu' && multipleTooltip && (React__default.createElement(MultipleTooltip, { open: compact && multipleTooltipActive, anchorRef: tooltipRef, placement: ['right-start'], items: items }))));
};
const CompositeBar = ({ type, items, menuMoreTitle, onItemClick, multipleTooltip = false, }) => {
    if (items.length === 0) {
        return null;
    }
    let node;
    if (type === 'menu') {
        const minHeight = getItemsMinHeight(items);
        const collapseItem = getMoreButtonItem(menuMoreTitle);
        node = (React__default.createElement("div", { className: b({ autosizer: true }), style: { minHeight } }, items.length !== 0 && (React__default.createElement(AutoSizer, null, (size) => {
            const width = Number.isNaN(size.width) ? 0 : size.width;
            const height = Number.isNaN(size.height) ? 0 : size.height;
            const { listItems, collapseItems } = getAutosizeListItems(items, height, collapseItem);
            return (React__default.createElement("div", { style: { width, height } },
                React__default.createElement(CompositeBarView, { type: "menu", items: listItems, onItemClick: onItemClick, collapseItems: collapseItems, multipleTooltip: multipleTooltip })));
        }))));
    }
    else {
        node = (React__default.createElement("div", { className: b({ subheader: true }) },
            React__default.createElement(CompositeBarView, { type: "subheader", items: items, onItemClick: onItemClick })));
    }
    return React__default.createElement(MultipleTooltipProvider, null, node);
};

export { CompositeBar };
//# sourceMappingURL=CompositeBar.js.map
