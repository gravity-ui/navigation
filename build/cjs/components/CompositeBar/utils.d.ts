import { CompositeBarItem } from '../CompositeBar/CompositeBar';
import { MenuItem } from './../types';
export declare function getItemHeight(item: CompositeBarItem): 40 | 50 | 15;
export declare function getItemsHeight<T extends CompositeBarItem>(items: T[]): number;
export declare function getSelectedItemIndex(items: MenuItem[]): number | undefined;
export declare function getPinnedItems(items: MenuItem[]): MenuItem[];
export declare function getItemsMinHeight(items: MenuItem[]): number;
export declare function getMoreButtonItem(menuMoreTitle?: string): MenuItem;
export declare function getAutosizeListItems(items: MenuItem[], height: number, collapseItem: MenuItem): {
    listItems: MenuItem[];
    collapseItems: MenuItem[];
};
export declare function isMenuItem(item: CompositeBarItem): item is MenuItem;
