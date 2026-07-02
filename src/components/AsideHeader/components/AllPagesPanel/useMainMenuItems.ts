import {useMemo} from 'react';

import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import {getMainMenuItemsForDisplay} from '../../quickAccess';

import {useQuickAccessMenuItems} from './useQuickAccessMenuItems';
import {useVisibleMenuItems} from './useVisibleMenuItems';

export const useMainMenuItems = () => {
    const {quickAccessHighlightInMainMenu} = useAsideHeaderInnerContext();
    const visibleMenuItems = useVisibleMenuItems();
    const quickAccessItems = useQuickAccessMenuItems();

    return useMemo(
        () =>
            getMainMenuItemsForDisplay(visibleMenuItems, quickAccessItems, {
                quickAccessHighlightInMainMenu,
            }),
        [visibleMenuItems, quickAccessItems, quickAccessHighlightInMainMenu],
    );
};
