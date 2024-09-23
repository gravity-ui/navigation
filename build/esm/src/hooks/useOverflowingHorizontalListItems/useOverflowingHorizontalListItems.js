import { useState, useLayoutEffect, useMemo } from 'react';
import debounce_1 from '../../../node_modules/lodash/debounce.js';

function useOverflowingHorizontalListItems({ containerRef, items, itemSelector, moreButtonWidth = 0, }) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [itemWidths, setItemWidths] = useState([]);
    useLayoutEffect(() => {
        if (!containerRef.current) {
            return;
        }
        const measureItemSizes = () => {
            var _a, _b;
            const itemElements = Array.from((_b = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll(itemSelector)) !== null && _b !== void 0 ? _b : []);
            setItemWidths(itemElements.map((item) => item.clientWidth));
        };
        measureItemSizes();
    }, [containerRef, itemSelector]);
    useLayoutEffect(() => {
        const footerMenu = containerRef.current;
        if (!footerMenu) {
            return;
        }
        const updateContainerSize = (entries) => {
            if (entries.length > 0 && footerMenu) {
                setContainerWidth(entries[0].contentRect.width);
            }
        };
        const updateContainerSizeDebounced = debounce_1(updateContainerSize, 100);
        const footerMenuResizeObserver = new ResizeObserver(updateContainerSizeDebounced);
        footerMenuResizeObserver.observe(footerMenu);
    }, [containerRef]);
    const isMeasured = containerWidth > 0;
    const { visibleItems, hiddenItems } = useMemo(() => {
        var _a, _b;
        if (!isMeasured) {
            return {
                visibleItems: items !== null && items !== void 0 ? items : [],
                hiddenItems: [],
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
            visibleItems: (_a = items === null || items === void 0 ? void 0 : items.slice(0, visibleItemsCount)) !== null && _a !== void 0 ? _a : [],
            hiddenItems: (_b = items === null || items === void 0 ? void 0 : items.slice(visibleItemsCount)) !== null && _b !== void 0 ? _b : [],
        };
    }, [containerWidth, isMeasured, itemWidths, items, moreButtonWidth]);
    return { visibleItems, hiddenItems, measured: isMeasured };
}

export { useOverflowingHorizontalListItems };
//# sourceMappingURL=useOverflowingHorizontalListItems.js.map
