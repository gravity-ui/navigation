'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const React = require('react');
const debounceFn = require('lodash.debounce');

function useOverflowingHorizontalListItems({
  containerRef,
  items,
  itemSelector,
  moreButtonWidth = 0
}) {
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [itemWidths, setItemWidths] = React.useState([]);
  React.useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const measureItemSizes = () => {
      const itemElements = Array.from(
        containerRef.current?.querySelectorAll(itemSelector) ?? []
      );
      setItemWidths(itemElements.map((item) => item.clientWidth));
    };
    measureItemSizes();
  }, [containerRef, itemSelector]);
  React.useLayoutEffect(() => {
    const footerMenu = containerRef.current;
    if (!footerMenu) {
      return;
    }
    const updateContainerSize = (entries) => {
      if (entries.length > 0 && footerMenu) {
        setContainerWidth(entries[0].contentRect.width);
      }
    };
    const updateContainerSizeDebounced = debounceFn(updateContainerSize, 100);
    const footerMenuResizeObserver = new ResizeObserver(updateContainerSizeDebounced);
    footerMenuResizeObserver.observe(footerMenu);
  }, [containerRef]);
  const isMeasured = containerWidth > 0;
  const { visibleItems, hiddenItems } = React.useMemo(() => {
    if (!isMeasured) {
      return {
        visibleItems: items ?? [],
        hiddenItems: []
      };
    }
    const itemsCount = itemWidths.length;
    let visibleItemsCount = 0;
    let remainingContainerWidth = containerWidth;
    for (const width of itemWidths) {
      remainingContainerWidth -= width;
      if (remainingContainerWidth < moreButtonWidth) {
        const isMoreThanOneItemLeft = itemsCount !== visibleItemsCount + 1;
        const hasNoSpaceForTheLastItem = remainingContainerWidth < 0;
        if (isMoreThanOneItemLeft || hasNoSpaceForTheLastItem) {
          break;
        }
      }
      visibleItemsCount++;
    }
    return {
      visibleItems: items?.slice(0, visibleItemsCount) ?? [],
      hiddenItems: items?.slice(visibleItemsCount) ?? []
    };
  }, [containerWidth, isMeasured, itemWidths, items, moreButtonWidth]);
  return { visibleItems, hiddenItems, measured: isMeasured };
}

exports.useOverflowingHorizontalListItems = useOverflowingHorizontalListItems;
//# sourceMappingURL=useOverflowingHorizontalListItems.cjs.map
