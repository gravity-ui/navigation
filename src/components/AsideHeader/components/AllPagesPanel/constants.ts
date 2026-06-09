import {Ellipsis} from '@gravity-ui/icons';

import {ALL_PAGES_ID, AsideHeaderItem} from '../../types';

import i18n from './i18n';

export {ALL_PAGES_ID} from '../../types';

export function getAllPagesMenuItem(): AsideHeaderItem {
    return {
        id: ALL_PAGES_ID,
        title: i18n('menu-item.all-pages.title'),
        tooltipText: i18n('menu-item.all-pages.title'),
        icon: Ellipsis,
    };
}
