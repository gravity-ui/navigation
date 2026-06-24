import {useMemo} from 'react';

import {getMainMenuItemsForDisplay} from '../../quickAccess';

import {useQuickAccessMenuItems} from './useQuickAccessMenuItems';
import {useVisibleMenuItems} from './useVisibleMenuItems';

export const useMainMenuItems = () => {
    const visibleMenuItems = useVisibleMenuItems();
    const quickAccessItems = useQuickAccessMenuItems();

    return useMemo(
        () => getMainMenuItemsForDisplay(visibleMenuItems, quickAccessItems),
        [visibleMenuItems, quickAccessItems],
    );
};
