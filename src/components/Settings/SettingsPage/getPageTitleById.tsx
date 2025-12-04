import type {SettingsMenu as SettingsMenuType} from '../collect-settings';

export const getPageTitleById = (menu: SettingsMenuType, activePage: string) => {
    for (const firstLevel of menu) {
        if ('groupTitle' in firstLevel) {
            for (const secondLevel of firstLevel.items)
                if (secondLevel.id === activePage) return secondLevel.title;
        } else if (firstLevel.id === activePage) return firstLevel.title;
    }

    return '';
};
