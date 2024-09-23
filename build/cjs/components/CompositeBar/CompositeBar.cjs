'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const reactVirtualizedAutoSizer_esm = require('../../node_modules/react-virtualized-auto-sizer/dist/react-virtualized-auto-sizer.esm.cjs');
const AsideHeaderContext = require('../AsideHeader/AsideHeaderContext.cjs');
const constants = require('../constants.cjs');
const cn = require('../utils/cn.cjs');
const Item = require('./Item/Item.cjs');
const constants$1 = require('./constants.cjs');
const utils = require('./utils.cjs');
;/* empty css                    */
const MultipleTooltipContext = require('./MultipleTooltip/MultipleTooltipContext.cjs');
const MultipleTooltip = require('./MultipleTooltip/MultipleTooltip.cjs');

const b = cn.block("composite-bar");
const CompositeBarView = ({
  type,
  items,
  onItemClick,
  collapseItems,
  multipleTooltip = false
}) => {
  const ref = React.useRef(null);
  const tooltipRef = React.useRef(null);
  const {
    setValue: setMultipleTooltipContextValue,
    active: multipleTooltipActive,
    activeIndex,
    lastClickedItemIndex
  } = React.useContext(MultipleTooltipContext.MultipleTooltipContext);
  const { compact } = AsideHeaderContext.useAsideHeaderContext();
  React.useEffect(() => {
    function handleBlurWindow() {
      if (multipleTooltip && multipleTooltipActive) {
        setMultipleTooltipContextValue({ active: false });
      }
    }
    window.addEventListener("blur", handleBlurWindow);
    return () => {
      window.removeEventListener("blur", handleBlurWindow);
    };
  }, [multipleTooltip, multipleTooltipActive, setMultipleTooltipContextValue]);
  const onTooltipMouseEnter = React.useCallback(
    (e) => {
      if (multipleTooltip && compact && !multipleTooltipActive && document.hasFocus() && activeIndex !== lastClickedItemIndex && e.clientX <= constants.ASIDE_HEADER_COMPACT_WIDTH) {
        setMultipleTooltipContextValue?.({
          active: true
        });
      }
    },
    [
      multipleTooltip,
      compact,
      multipleTooltipActive,
      activeIndex,
      lastClickedItemIndex,
      setMultipleTooltipContextValue
    ]
  );
  const onTooltipMouseLeave = React.useCallback(() => {
    if (multipleTooltip && multipleTooltipActive && document.hasFocus()) {
      setMultipleTooltipContextValue?.({
        active: false,
        lastClickedItemIndex: void 0
      });
    }
  }, [multipleTooltip, multipleTooltipActive, setMultipleTooltipContextValue]);
  const onMouseEnterByIndex = React.useCallback(
    (itemIndex) => () => {
      if (multipleTooltip && document.hasFocus()) {
        let multipleTooltipActiveValue = multipleTooltipActive;
        if (!multipleTooltipActive && itemIndex !== lastClickedItemIndex) {
          multipleTooltipActiveValue = true;
        }
        if (activeIndex === itemIndex && multipleTooltipActive === multipleTooltipActiveValue) {
          return;
        }
        setMultipleTooltipContextValue({
          activeIndex: itemIndex,
          active: multipleTooltipActiveValue
        });
      }
    },
    [
      multipleTooltip,
      multipleTooltipActive,
      lastClickedItemIndex,
      activeIndex,
      setMultipleTooltipContextValue
    ]
  );
  const onMouseLeave = React.useCallback(() => {
    if (compact && document.hasFocus()) {
      ref.current?.activateItem(void 0);
      if (multipleTooltip && (activeIndex !== void 0 || lastClickedItemIndex !== void 0)) {
        setMultipleTooltipContextValue({
          activeIndex: void 0,
          lastClickedItemIndex: void 0
        });
      }
    }
  }, [
    activeIndex,
    compact,
    lastClickedItemIndex,
    multipleTooltip,
    setMultipleTooltipContextValue
  ]);
  const onItemClickByIndex = React.useCallback(
    (itemIndex) => (item, collapsed, event) => {
      if (compact && multipleTooltip && itemIndex !== lastClickedItemIndex && item.id !== constants$1.COLLAPSE_ITEM_ID) {
        setMultipleTooltipContextValue({
          lastClickedItemIndex: itemIndex,
          active: false
        });
      }
      onItemClick?.(item, collapsed, event);
    },
    [
      compact,
      lastClickedItemIndex,
      multipleTooltip,
      onItemClick,
      setMultipleTooltipContextValue
    ]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref: tooltipRef,
        onMouseEnter: onTooltipMouseEnter,
        onMouseLeave: onTooltipMouseLeave,
        children: /* @__PURE__ */ jsxRuntime.jsx(
          uikit.List,
          {
            ref,
            items,
            selectedItemIndex: type === "menu" ? utils.getSelectedItemIndex(items) : void 0,
            itemHeight: utils.getItemHeight,
            itemsHeight: utils.getItemsHeight,
            itemClassName: b("root-menu-item"),
            virtualized: false,
            filterable: false,
            sortable: false,
            renderItem: (item, _isItemActive, itemIndex) => {
              const itemExtraProps = utils.isMenuItem(item) ? { item } : item;
              const enableTooltip = utils.isMenuItem(item) ? !multipleTooltip : item.enableTooltip;
              return /* @__PURE__ */ jsxRuntime.jsx(
                Item.Item,
                {
                  ...itemExtraProps,
                  enableTooltip,
                  onMouseEnter: onMouseEnterByIndex(itemIndex),
                  onMouseLeave,
                  onItemClick: onItemClickByIndex(itemIndex),
                  collapseItems
                }
              );
            }
          }
        )
      }
    ),
    type === "menu" && multipleTooltip && /* @__PURE__ */ jsxRuntime.jsx(
      MultipleTooltip.MultipleTooltip,
      {
        open: compact && multipleTooltipActive,
        anchorRef: tooltipRef,
        placement: ["right-start"],
        items
      }
    )
  ] });
};
const CompositeBar = ({
  type,
  items,
  menuMoreTitle,
  onItemClick,
  multipleTooltip = false
}) => {
  if (items.length === 0) {
    return null;
  }
  let node;
  if (type === "menu") {
    const minHeight = utils.getItemsMinHeight(items);
    const collapseItem = utils.getMoreButtonItem(menuMoreTitle);
    node = /* @__PURE__ */ jsxRuntime.jsx("div", { className: b({ autosizer: true }), style: { minHeight }, children: items.length !== 0 && /* @__PURE__ */ jsxRuntime.jsx(reactVirtualizedAutoSizer_esm.default, { children: (size) => {
      const width = Number.isNaN(size.width) ? 0 : size.width;
      const height = Number.isNaN(size.height) ? 0 : size.height;
      const { listItems, collapseItems } = utils.getAutosizeListItems(
        items,
        height,
        collapseItem
      );
      return /* @__PURE__ */ jsxRuntime.jsx("div", { style: { width, height }, children: /* @__PURE__ */ jsxRuntime.jsx(
        CompositeBarView,
        {
          type: "menu",
          items: listItems,
          onItemClick,
          collapseItems,
          multipleTooltip
        }
      ) });
    } }) });
  } else {
    node = /* @__PURE__ */ jsxRuntime.jsx("div", { className: b({ subheader: true }), children: /* @__PURE__ */ jsxRuntime.jsx(CompositeBarView, { type: "subheader", items, onItemClick }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(MultipleTooltipContext.MultipleTooltipProvider, { children: node });
};

exports.CompositeBar = CompositeBar;
//# sourceMappingURL=CompositeBar.cjs.map
