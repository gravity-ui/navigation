import {COMPOSITE_BAR_ITEM_ID_ATTRIBUTE} from '../CompositeBar/constants';

export const CURRENT_ROW_SELECTOR = `[${COMPOSITE_BAR_ITEM_ID_ATTRIBUTE}]`;
export const CURRENT_IDS_ATTRIBUTE = 'data-gn-aside-current-ids';
export const SURFACE_SELECTOR = '[data-gn-aside-part="surface"]';
export const CURRENT_SUPPRESSED_ATTRIBUTE = 'data-gn-aside-current-suppressed';
export const CURRENT_GHOST_SUPPRESSED_ATTRIBUTE = 'data-gn-aside-current-ghost-suppressed';
export const CURRENT_ROW_KEY_ATTRIBUTE = 'data-gn-aside-current-row-key';

export function getCompositeBarSection(element: HTMLElement, fallback = 'footer'): string {
    // UIKit row wrappers append "-item-N" to the bar ID. They are layout
    // positions, not sections, and can change while the logical row persists.
    return element.closest('[id^="gravity-ui/navigation-"][id$="-composite-bar"]')?.id ?? fallback;
}
