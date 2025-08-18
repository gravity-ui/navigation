import {useMemo} from 'react';

import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import {AsideHeaderItem} from '../../types';

export const useVisibleMenuItems = (): AsideHeaderItem[] => {
    const {menuItems, allPagesIsAvailable} = useAsideHeaderInnerContext();
    return useMemo(() => {
        if (!allPagesIsAvailable) {
            return menuItems;
        }
        let lastVisibleIndex = 0;
        return menuItems.filter(
            ({type, hidden}: AsideHeaderItem, index: number, items: AsideHeaderItem[]): boolean => {
                if (hidden) {
                    return false;
                }

                if (
                    index > 0 &&
                    type === 'divider' &&
                    (items[lastVisibleIndex].type === 'divider' || items[lastVisibleIndex].hidden)
                ) {
                    return false;
                }
                lastVisibleIndex = index;
                return true;
            },
        );
    }, [allPagesIsAvailable, menuItems]);
};
