export type CurrentPresentation = {
    key: string;
    section: string;
    rowId: string;
    currentIds: string[];
    row: HTMLElement;
    surface: HTMLElement;
    rect: DOMRect;
    color: string;
    radius: string;
    inFlight?: boolean;
};
export type CurrentSnapshot = Map<string, CurrentPresentation>;
export type CurrentTransfer = {from: CurrentPresentation; to: CurrentPresentation};

export const CURRENT_ROW_SELECTOR = '[data-gn-composite-bar-item-id]';
const DECORATIVE_SELECTOR =
    '[data-gn-aside-transition-overlay], [data-gn-aside-current-indicator-layer]';

function getSection(row: HTMLElement) {
    // UIKit row wrappers append "-item-N" to the bar ID. They are layout
    // positions, not sections, and change when a current item moves into More.
    return row.closest('[id^="gravity-ui/navigation-"][id$="-composite-bar"]')?.id ?? 'footer';
}

export function getCurrentRowKey(row: HTMLElement): string {
    return JSON.stringify([getSection(row), row.getAttribute('data-gn-composite-bar-item-id')]);
}

export function captureCurrentPresentation(panel: HTMLElement): CurrentSnapshot {
    const snapshot: CurrentSnapshot = new Map();
    panel.querySelectorAll<HTMLElement>(CURRENT_ROW_SELECTOR).forEach((row) => {
        if (row.closest(DECORATIVE_SELECTOR)) return;
        let currentIds: unknown;
        try {
            currentIds = JSON.parse(row.getAttribute('data-gn-aside-current-ids') ?? '[]');
        } catch {
            return;
        }
        if (
            !Array.isArray(currentIds) ||
            !currentIds.length ||
            !currentIds.every((id) => typeof id === 'string')
        )
            return;
        const surface = row.querySelector<HTMLElement>('[data-gn-aside-part="surface"]');
        if (!surface) return;
        const rect = surface.getBoundingClientRect();
        const style = getComputedStyle(surface);
        const key = getCurrentRowKey(row);
        // Preserve duplicate representatives so matching can reject ambiguity.
        snapshot.set(`${key}/${snapshot.size}`, {
            key,
            section: getSection(row),
            rowId: row.getAttribute('data-gn-composite-bar-item-id') ?? '',
            currentIds,
            row,
            surface,
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
