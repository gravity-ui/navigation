import {useLayoutEffect, useMemo, useState} from 'react';
import type {RefObject} from 'react';

import debounceFn from 'lodash/debounce';

type UseOverflowingContainerListItemsProps<ItemType extends unknown> = {
    containerRef: RefObject<HTMLElement>;
    items?: ItemType[];
    itemSelector: string;
    moreButtonWidth?: number;
};

export function useOverflowingHorizontalListItems<ItemType>({
    containerRef,
    items,
    itemSelector,
    moreButtonWidth = 0,
}: UseOverflowingContainerListItemsProps<ItemType>) {
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [itemWidths, setItemWidths] = useState<number[]>([]);

    useLayoutEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const measureItemSizes = () => {
            const itemElements = Array.from(
                containerRef.current?.querySelectorAll(itemSelector) ?? [],
            );
            setItemWidths(itemElements.map((item) => item.clientWidth));
        };

        measureItemSizes();
    }, [containerRef, itemSelector]);

    useLayoutEffect(() => {
        const footerMenu = containerRef.current;

        const updateContainerSize = (entries: ResizeObserverEntry[]) => {
            if (entries.length > 0 && footerMenu) {
                setContainerWidth(entries[0].contentRect.width);
            }
        };

        const updateContainerSizeDebounced = debounceFn(updateContainerSize, 100);
        const footerMenuResizeObserver = new ResizeObserver(updateContainerSizeDebounced);

        if (footerMenu) {
            footerMenuResizeObserver.observe(footerMenu);
        }

        return () => {
            updateContainerSizeDebounced.cancel();
            footerMenuResizeObserver.disconnect();
        };
    }, [containerRef]);

    const isMeasured = containerWidth > 0;

    const {visibleItems, hiddenItems} = useMemo(() => {
        if (!isMeasured) {
            return {
                visibleItems: items ?? [],
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
            visibleItems: items?.slice(0, visibleItemsCount) ?? [],
            hiddenItems: items?.slice(visibleItemsCount) ?? [],
        };
    }, [containerWidth, isMeasured, itemWidths, items, moreButtonWidth]);

    return {visibleItems, hiddenItems, measured: isMeasured};
}
