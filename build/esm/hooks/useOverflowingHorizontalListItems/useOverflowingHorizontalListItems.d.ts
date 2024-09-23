import type { RefObject } from 'react';
export type UseOverflowingContainerListItemsProps<ItemType extends unknown> = {
    containerRef: RefObject<HTMLElement>;
    items?: ItemType[];
    itemSelector: string;
    moreButtonWidth?: number;
};
export declare function useOverflowingHorizontalListItems<ItemType>({ containerRef, items, itemSelector, moreButtonWidth, }: UseOverflowingContainerListItemsProps<ItemType>): {
    visibleItems: ItemType[];
    hiddenItems: ItemType[];
    measured: boolean;
};
