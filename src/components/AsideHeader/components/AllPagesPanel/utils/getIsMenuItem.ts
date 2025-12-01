import {MenuItemsWithGroups} from 'src/components/AsideHeader/types';

import {ALL_PAGES_ID} from '../constants';

export function getIsMenuItem(item: MenuItemsWithGroups): boolean {
    const isDivider = item.type === 'divider';
    const isAction = item.type === 'action';
    const isAllPages = item.id === ALL_PAGES_ID;

    return !isDivider && !isAction && !isAllPages;
}
