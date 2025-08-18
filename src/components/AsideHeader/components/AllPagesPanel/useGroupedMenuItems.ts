import {useMemo} from 'react';

import {AsideHeaderItem} from '../../types';

import {ALL_PAGES_ID} from './constants';
import i18n from './i18n';

export const useGroupedMenuItems = (asideHeaderItems: AsideHeaderItem[]) => {
    const allPagesMenuItems = useMemo(() => {
        const filteredItems = asideHeaderItems.filter(
            ({id, type}) => type !== 'divider' && id !== ALL_PAGES_ID,
        );
        filteredItems.sort(({type: typeA}, {type: typeB}) => {
            if (typeA === 'action') {
                return 1;
            }
            if (typeB === 'action') {
                return -1;
            }
            return 0;
        });
        const groupedItems = filteredItems.reduce(
            (acc, asideHeaderItem) => {
                const category =
                    asideHeaderItem.category || i18n('all-panel.menu.category.allOther');
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(asideHeaderItem);
                return acc;
            },
            {} as {[key: string]: AsideHeaderItem[]},
        );
        return groupedItems;
    }, [asideHeaderItems]);

    return allPagesMenuItems;
};
