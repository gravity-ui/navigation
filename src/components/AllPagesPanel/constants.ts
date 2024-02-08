import {Ellipsis} from '@gravity-ui/icons';

import {MenuItem} from '../types';

import i18n from './i18n';

export const ALL_PAGES_ID = 'all-pages' as const;

export function getAllPagesMenuItem(): MenuItem {
    return {
        id: ALL_PAGES_ID,
        title: i18n('menu-item.all-pages.title'),
        tooltipText: i18n('menu-item.all-pages.title'),
        icon: Ellipsis,
    };
}
