import { j as jsxRuntimeExports } from '../../node_modules/react/jsx-runtime.mjs';
import React, { r as reactExports } from '../../node_modules/react/index.mjs';
import AutoSizer from '../../node_modules/react-virtualized-auto-sizer/dist/react-virtualized-auto-sizer.esm.mjs';
import { useAsideHeaderContext } from '../AsideHeader/AsideHeaderContext.mjs';
import { ASIDE_HEADER_COMPACT_WIDTH } from '../constants.mjs';
import { block } from '../utils/cn.mjs';
import { Item } from './Item/Item.mjs';
import { COLLAPSE_ITEM_ID } from './constants.mjs';
import { getItemsMinHeight, getAutosizeListItems, getSelectedItemIndex, getItemHeight, getItemsHeight, isMenuItem, getMoreButtonItem } from './utils.mjs';
/* empty css                   */
import { MultipleTooltipProvider, MultipleTooltipContext } from './MultipleTooltip/MultipleTooltipContext.mjs';
import { MultipleTooltip } from './MultipleTooltip/MultipleTooltip.mjs';
import { List } from '../../node_modules/@gravity-ui/uikit/build/esm/components/List/List.mjs';

const b = block("composite-bar");
const CompositeBarView = ({
  type,
  items,
  onItemClick,
  collapseItems,
  multipleTooltip = false
}) => {
  const ref = reactExports.useRef(null);
  const tooltipRef = reactExports.useRef(null);
  const {
    setValue: setMultipleTooltipContextValue,
    active: multipleTooltipActive,
    activeIndex,
    lastClickedItemIndex
  } = reactExports.useContext(MultipleTooltipContext);
  const { compact } = useAsideHeaderContext();
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
  const onTooltipMouseEnter = reactExports.useCallback(
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
  const onTooltipMouseLeave = reactExports.useCallback(() => {
    if (multipleTooltip && multipleTooltipActive && document.hasFocus()) {
      setMultipleTooltipContextValue?.({
        active: false,
        lastClickedItemIndex: void 0
      });
    }
  }, [multipleTooltip, multipleTooltipActive, setMultipleTooltipContextValue]);
  const onMouseEnterByIndex = reactExports.useCallback(
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
  const onMouseLeave = reactExports.useCallback(() => {
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
  const onItemClickByIndex = reactExports.useCallback(
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: tooltipRef,
        onMouseEnter: onTooltipMouseEnter,
        onMouseLeave: onTooltipMouseLeave,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
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
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
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
    type === "menu" && multipleTooltip && /* @__PURE__ */ jsxRuntimeExports.jsx(
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
    node = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b({ autosizer: true }), style: { minHeight }, children: items.length !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(AutoSizer, { children: (size) => {
      const width = Number.isNaN(size.width) ? 0 : size.width;
      const height = Number.isNaN(size.height) ? 0 : size.height;
      const { listItems, collapseItems } = getAutosizeListItems(
        items,
        height,
        collapseItem
      );
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width, height }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
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
    node = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b({ subheader: true }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompositeBarView, { type: "subheader", items, onItemClick }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MultipleTooltipProvider, { children: node });
};

export { CompositeBar };
//# sourceMappingURL=CompositeBar.mjs.map
