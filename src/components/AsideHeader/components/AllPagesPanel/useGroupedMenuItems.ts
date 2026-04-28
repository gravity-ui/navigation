import {useMemo} from 'react';

import type {MenuGroup} from '../../../types';
import {ALL_PAGES_ID, AsideHeaderItem} from '../../types';

import {getAllPagesEditModeFlatItems} from './allPagesEditDisplay';
import i18n from './i18n';

/**
 * Group menu items by category for the All pages panel.
 *
 * @param asideHeaderItems — items from context (includes synthetic All pages row).
 * @param editMode — when true, applies edit-mode row selection (headers when `menuGroups` is set).
 * @param menuGroups — when provided with edit mode, inserts one CompositeBar-style header per group.
 * @returns Items grouped by `category` key for rendering sections.
 */
export const useGroupedMenuItems = (
    asideHeaderItems: AsideHeaderItem[],
    editMode?: boolean,
    menuGroups?: MenuGroup[],
) => {
    const allPagesMenuItems = useMemo(() => {
        const base = asideHeaderItems.filter(
            ({id, type}) => type !== 'divider' && id !== ALL_PAGES_ID,
        );

        let flatForGrouping: AsideHeaderItem[];

        if (!editMode) {
            flatForGrouping = base;
        } else if (menuGroups?.length) {
            flatForGrouping = getAllPagesEditModeFlatItems(base, menuGroups);
        } else {
            flatForGrouping = base.filter((item) => !item.groupId);
        }

        flatForGrouping.sort(({type: typeA}, {type: typeB}) => {
            if (typeA === 'action') {
                return 1;
            }
            if (typeB === 'action') {
                return -1;
            }
            return 0;
        });
        const groupedItems = flatForGrouping.reduce(
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
    }, [asideHeaderItems, editMode, menuGroups]);

    return allPagesMenuItems;
};
