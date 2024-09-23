import { jsx, jsxs } from 'react/jsx-runtime';
import React__default, { useRef, useContext, useCallback } from 'react';
import { List } from '@gravity-ui/uikit';
import AutoSizer from './index.es130.js';
import { useAsideHeaderContext } from './index.es3.js';
import { ASIDE_HEADER_COMPACT_WIDTH } from './index.es23.js';
import { block } from './index.es24.js';
import { Item } from './index.es22.js';
import { COLLAPSE_ITEM_ID } from './index.es39.js';
import { getItemsMinHeight, getAutosizeListItems, getSelectedItemIndex, getItemHeight, getItemsHeight, isMenuItem, getMoreButtonItem } from './index.es40.js';
/* empty css            */
import { MultipleTooltipProvider, MultipleTooltipContext } from './index.es132.js';
import { MultipleTooltip } from './index.es133.js';

const b = block("composite-bar");
const CompositeBarView = ({
  type,
  items,
  onItemClick,
  collapseItems,
  multipleTooltip = false
}) => {
  const ref = useRef(null);
  const tooltipRef = useRef(null);
  const {
    setValue: setMultipleTooltipContextValue,
    active: multipleTooltipActive,
    activeIndex,
    lastClickedItemIndex
  } = useContext(MultipleTooltipContext);
  const { compact } = useAsideHeaderContext();
  React__default.useEffect(() => {
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
  const onTooltipMouseEnter = useCallback(
    (e) => {
      if (multipleTooltip && compact && !multipleTooltipActive && document.hasFocus() && activeIndex !== lastClickedItemIndex && e.clientX <= ASIDE_HEADER_COMPACT_WIDTH) {
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
  const onTooltipMouseLeave = useCallback(() => {
    if (multipleTooltip && multipleTooltipActive && document.hasFocus()) {
      setMultipleTooltipContextValue?.({
        active: false,
        lastClickedItemIndex: void 0
      });
    }
  }, [multipleTooltip, multipleTooltipActive, setMultipleTooltipContextValue]);
  const onMouseEnterByIndex = useCallback(
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
  const onMouseLeave = useCallback(() => {
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
  const onItemClickByIndex = useCallback(
    (itemIndex) => (item, collapsed, event) => {
      if (compact && multipleTooltip && itemIndex !== lastClickedItemIndex && item.id !== COLLAPSE_ITEM_ID) {
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
  return /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: tooltipRef,
        onMouseEnter: onTooltipMouseEnter,
        onMouseLeave: onTooltipMouseLeave,
        children: /* @__PURE__ */ jsx(
          List,
          {
            ref,
            items,
            selectedItemIndex: type === "menu" ? getSelectedItemIndex(items) : void 0,
            itemHeight: getItemHeight,
            itemsHeight: getItemsHeight,
            itemClassName: b("root-menu-item"),
            virtualized: false,
            filterable: false,
            sortable: false,
            renderItem: (item, _isItemActive, itemIndex) => {
              const itemExtraProps = isMenuItem(item) ? { item } : item;
              const enableTooltip = isMenuItem(item) ? !multipleTooltip : item.enableTooltip;
              return /* @__PURE__ */ jsx(
                Item,
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
    type === "menu" && multipleTooltip && /* @__PURE__ */ jsx(
      MultipleTooltip,
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
    const minHeight = getItemsMinHeight(items);
    const collapseItem = getMoreButtonItem(menuMoreTitle);
    node = /* @__PURE__ */ jsx("div", { className: b({ autosizer: true }), style: { minHeight }, children: items.length !== 0 && /* @__PURE__ */ jsx(AutoSizer, { children: (size) => {
      const width = Number.isNaN(size.width) ? 0 : size.width;
      const height = Number.isNaN(size.height) ? 0 : size.height;
      const { listItems, collapseItems } = getAutosizeListItems(
        items,
        height,
        collapseItem
      );
      return /* @__PURE__ */ jsx("div", { style: { width, height }, children: /* @__PURE__ */ jsx(
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
    node = /* @__PURE__ */ jsx("div", { className: b({ subheader: true }), children: /* @__PURE__ */ jsx(CompositeBarView, { type: "subheader", items, onItemClick }) });
  }
  return /* @__PURE__ */ jsx(MultipleTooltipProvider, { children: node });
};

export { CompositeBar };
//# sourceMappingURL=index.es102.js.map
