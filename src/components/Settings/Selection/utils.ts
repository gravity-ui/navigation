import {SelectedSettingsPart, SettingsPageSection} from '../collect-settings';

export function isSectionSelected(
    selected: SelectedSettingsPart,
    pageId: string,
    section: SettingsPageSection,
) {
    if (!selected.section || selected.setting) {
        return false;
    } else if (selected.section.id && selected.section.id === section.id) {
        return true;
    } else if (
        selected.page?.id === pageId &&
        selected.section.title &&
        selected.section.title === section.title
    ) {
        return true;
    } else {
        return false;
    }
}
