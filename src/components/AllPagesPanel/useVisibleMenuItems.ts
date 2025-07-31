import {useMemo} from 'react';

import {useAsideHeaderInnerContext} from '../AsideHeader/AsideHeaderContext';
import {AsideHeaderItem} from '../AsideHeader/types';

export const useVisibleMenuItems = (): AsideHeaderItem[] => {
    const {menuItems, allPagesIsAvailable} = useAsideHeaderInnerContext();
    return useMemo(() => {
        if (!allPagesIsAvailable) {
            return menuItems;
        }
        let lastVisibleIndex = 0;
        return menuItems.filter(
            ({item}: AsideHeaderItem, index: number, items: AsideHeaderItem[]): boolean => {
                if (item.hidden) {
                    return false;
                }

                if (
                    index > 0 &&
                    item.type === 'divider' &&
                    (items[lastVisibleIndex].item.type === 'divider' ||
                        items[lastVisibleIndex].item.hidden)
                ) {
                    return false;
                }
                lastVisibleIndex = index;
                return true;
            },
        );
    }, [allPagesIsAvailable, menuItems]);
};
