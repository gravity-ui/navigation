import {ITEM_HEIGHT} from '../../constants';
import {MenuItemsWithGroups} from '../types';

export function getGroupBlockHeight(items: MenuItemsWithGroups[]) {
    return (items.length + 1) * ITEM_HEIGHT;
}
