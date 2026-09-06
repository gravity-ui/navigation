import {COMPOSITE_BAR_ITEM_ID_ATTRIBUTE} from '../CompositeBar/constants';

import {
    CURRENT_IDS_ATTRIBUTE,
    CURRENT_ROW_SELECTOR,
    SURFACE_SELECTOR,
    getCompositeBarSection,
} from './currentIndicatorDom';

export type CurrentIdentity = {
    key: string;
    section: string;
    rowId: string;
    currentIds: string[];
    row: HTMLElement;
    surface: HTMLElement;
};
export type CurrentIdentitySnapshot = Map<HTMLElement, CurrentIdentity>;
export type CurrentPresentation = CurrentIdentity & {
    rect: DOMRect;
    color: string;
    radius: string;
    inFlight?: boolean;
};
export type CurrentSnapshot = Map<string, CurrentPresentation>;
export type CurrentTransfer = {from: CurrentPresentation; to: CurrentPresentation};

const DECORATIVE_SELECTOR =
    '[data-gn-aside-transition-overlay], [data-gn-aside-current-indicator-layer]';

export function getCurrentRowKey(row: HTMLElement): string {
    return JSON.stringify([
        getCompositeBarSection(row),
        row.getAttribute(COMPOSITE_BAR_ITEM_ID_ATTRIBUTE),
    ]);
}

export function captureCurrentIdentity(panel: HTMLElement): CurrentIdentitySnapshot {
    const snapshot: CurrentIdentitySnapshot = new Map();
    panel.querySelectorAll<HTMLElement>(CURRENT_ROW_SELECTOR).forEach((row) => {
        if (row.closest(DECORATIVE_SELECTOR)) return;
        let currentIds: unknown;
        try {
            currentIds = JSON.parse(row.getAttribute(CURRENT_IDS_ATTRIBUTE) ?? '[]');
        } catch {
            return;
        }
        if (
            !Array.isArray(currentIds) ||
            !currentIds.length ||
            !currentIds.every((id) => typeof id === 'string')
        )
            return;
        const surface = row.querySelector<HTMLElement>(SURFACE_SELECTOR);
        if (!surface) return;
        snapshot.set(row, {
            key: getCurrentRowKey(row),
            section: getCompositeBarSection(row),
            rowId: row.getAttribute(COMPOSITE_BAR_ITEM_ID_ATTRIBUTE) ?? '',
            currentIds,
            row,
            surface,
        });
    });
    return snapshot;
}

export function captureCurrentPresentation(
    panel: HTMLElement,
    identities = captureCurrentIdentity(panel),
): CurrentSnapshot {
    const snapshot: CurrentSnapshot = new Map();
    identities.forEach((identity) => {
        const rect = identity.surface.getBoundingClientRect();
        const style = getComputedStyle(identity.surface);
        // Preserve duplicate representatives so matching can reject ambiguity.
        snapshot.set(`${identity.key}/${snapshot.size}`, {
            ...identity,
            rect,
            color: style.backgroundColor,
            radius: style.borderRadius,
        });
    });
    return snapshot;
}

function indexCurrents(snapshot: CurrentSnapshot) {
    const currents = new Map<string, CurrentPresentation[]>();
    snapshot.forEach((presentation) => {
        presentation.currentIds.forEach((id) => {
            const key = JSON.stringify([presentation.section, id]);
            currents.set(key, [...(currents.get(key) ?? []), presentation]);
        });
    });
    return currents;
}

export function matchCurrentPresentations(
    before: CurrentSnapshot,
    after: CurrentSnapshot,
): CurrentTransfer[] {
    const targets = indexCurrents(after);
    const transfers: CurrentTransfer[] = [];
    indexCurrents(before).forEach((sources, key) => {
        const destinations = targets.get(key);
        if (sources.length !== 1 || destinations?.length !== 1) return;
        const [from] = sources;
        const [to] = destinations;
        if (from.currentIds.length !== 1 || to.currentIds.length !== 1) return;
        if (from.key === to.key && !from.inFlight) return;
        if (![from, to].every(({rect}) => rect.width > 0 && rect.height > 0)) return;
        transfers.push({from, to});
    });
    return transfers;
}
