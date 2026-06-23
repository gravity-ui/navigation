import {useMemo} from 'react';

import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import {isQuickAccessMenuItem} from '../../quickAccess';
import {AsideHeaderItem} from '../../types';

import {useVisibleMenuItems} from './useVisibleMenuItems';

export const useQuickAccessMenuItems = (): AsideHeaderItem[] => {
    const {enableQuickAccess} = useAsideHeaderInnerContext();
    const visibleMenuItems = useVisibleMenuItems();

    return useMemo(() => {
        if (!enableQuickAccess) {
            return [];
        }

        return visibleMenuItems.filter(isQuickAccessMenuItem);
    }, [enableQuickAccess, visibleMenuItems]);
};
