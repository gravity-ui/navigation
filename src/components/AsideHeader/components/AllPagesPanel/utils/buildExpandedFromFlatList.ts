import {MenuItem} from '../../../../types';
import {MenuItemsWithGroups} from '../../../types';

export function buildExpandedFromFlatList(flatList: MenuItemsWithGroups[]): MenuItem[] {
    const expanded: MenuItem[] = [];

    flatList.forEach((item) => {
        if ('items' in item && item.items && item.items.length > 0) {
            expanded.push(...item.items);
        } else {
            expanded.push(item);
        }
    });

    return expanded;
}
