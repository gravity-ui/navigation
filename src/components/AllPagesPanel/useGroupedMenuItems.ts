import {useMemo} from 'react';

import {MenuItem} from '../types';
import {ALL_PAGES_ID} from './constants';
import i18n from './i18n';

export const useGroupedMenuItems = (items: MenuItem[]) => {
    const allPagesMenuItems = useMemo(() => {
        const filteredItems = items.filter(
            (item) => item.type !== 'divider' && item.id !== ALL_PAGES_ID,
        );
        const groupedItems = filteredItems.reduce((acc, item) => {
            const category = item.category || i18n('all-panel.menu.category.allOther');
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {} as {[key: string]: MenuItem[]});
        return groupedItems;
    }, [items]);

    return allPagesMenuItems;
};
