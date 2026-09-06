import {
    CURRENT_ROW_SELECTOR,
    type CurrentPresentation,
    type CurrentSnapshot,
    type CurrentTransfer,
    captureCurrentPresentation,
    getCurrentRowKey,
} from './currentIndicatorModel';

const SURFACE_SELECTOR = '[data-gn-aside-part="surface"]';
const SUPPRESSED = 'data-gn-aside-current-suppressed';
const GHOST_SUPPRESSED = 'data-gn-aside-current-ghost-suppressed';
const ROW_KEY = 'data-gn-aside-current-row-key';

type ActiveTransfer = {
    transfer: CurrentTransfer;
    indicator: HTMLElement;
    layer: HTMLElement;
    animation: Animation;
    surfaces: Set<HTMLElement>;
    rowKeys: Set<string>;
};

export class CurrentIndicatorTransition {
    private active = new Set<ActiveTransfer>();
    private observer?: MutationObserver;

    private getObserverRoot?: () => HTMLElement | null;
    private onNativePaintInvalidated?: (surfaces?: Set<HTMLElement>) => void;
    private nativeCurrent: CurrentPresentation[] = [];

    constructor(
        getObserverRoot?: () => HTMLElement | null,
        onNativePaintInvalidated?: (surfaces?: Set<HTMLElement>) => void,
    ) {
        this.getObserverRoot = getObserverRoot;
        this.onNativePaintInvalidated = onNativePaintInvalidated;
    }

    capture(panel: HTMLElement): CurrentSnapshot {
        // A parent can change current and compact in one task, before observer
        // delivery. Restore invalid transfers before reading native paint.
        this.validate(panel);
        const snapshot = captureCurrentPresentation(panel);
        snapshot.forEach((presentation, key) => {
            const active = Array.from(this.active).find(
                ({transfer}) => transfer.to.row === presentation.row,
            );
            if (!active) return;
            const style = getComputedStyle(active.indicator);
            snapshot.set(key, {
                ...presentation,
                rect: active.indicator.getBoundingClientRect(),
                color: style.backgroundColor,
                radius: style.borderRadius,
                inFlight: true,
            });
        });
        return snapshot;
    }

    start(
        panel: HTMLElement,
        transfers: CurrentTransfer[],
        options: KeyframeAnimationOptions,
        startTime: Animation['startTime'],
    ): void {
        this.cancel();
        this.nativeCurrent = [...captureCurrentPresentation(panel).values()];
        const layers = new Map<HTMLElement, HTMLElement>();
        transfers.forEach((transfer) => {
            const {from, to} = transfer;
            const host = to.row.closest<HTMLElement>('[data-gn-aside-current-container]');
            if (!host || typeof host.animate !== 'function') return;
            const hostRect = host.getBoundingClientRect();
            let layer = layers.get(host);
            if (!layer) {
                layer = document.createElement('div');
                layer.setAttribute('data-gn-aside-current-indicator-layer', '');
                layer.setAttribute('aria-hidden', 'true');
                layer.setAttribute('inert', '');
                const scrollRect = host
                    .closest('[data-gn-aside-scrollport]')
                    ?.getBoundingClientRect();
                Object.assign(layer.style, {
                    position: 'absolute',
                    insetBlock: '0',
                    left: '0',
                    width: `${Math.max(0, (scrollRect?.right ?? hostRect.right) - hostRect.left)}px`,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: '0',
                });
                host.prepend(layer);
                layers.set(host, layer);
            }
            const indicator = document.createElement('div');
            indicator.setAttribute('data-gn-aside-current-indicator', '');
            indicator.style.position = 'absolute';
            const frame = (presentation: CurrentTransfer['from']): Keyframe => ({
                left: `${presentation.rect.x - hostRect.x}px`,
                top: `${presentation.rect.y - hostRect.y}px`,
                width: `${presentation.rect.width}px`,
                height: `${presentation.rect.height}px`,
                borderRadius: presentation.radius,
                backgroundColor: presentation.color,
            });
            Object.assign(indicator.style, frame(to));
            layer.append(indicator);
            const rowKeys = new Set([from.key, to.key]);
            const surfaces = new Set<HTMLElement>();
            panel.querySelectorAll<HTMLElement>(CURRENT_ROW_SELECTOR).forEach((row) => {
                if (
                    row.closest('[data-gn-aside-transition-overlay]') ||
                    !rowKeys.has(getCurrentRowKey(row))
                )
                    return;
                const surface = row.querySelector<HTMLElement>(SURFACE_SELECTOR);
                if (surface) {
                    surface.setAttribute(SUPPRESSED, '');
                    surfaces.add(surface);
                }
            });
            const animation = indicator.animate([frame(from), frame(to)], options);
            if (startTime !== null) animation.startTime = startTime;
            const active = {transfer, indicator, layer, animation, surfaces, rowKeys};
            this.active.add(active);
            // Membership is the generation guard: stale finished promises cannot
            // remove resources belonging to a subsequently started transfer.
            animation.finished.then(
                () => this.release(active),
                () => this.release(active),
            );
        });
        if (!this.active.size) return;
        this.observer = new MutationObserver(() => this.validate(panel));
        this.observer.observe(this.getObserverRoot?.() ?? panel.parentElement ?? panel, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: [
                'data-gn-aside-current-ids',
                'data-gn-composite-bar-item-id',
                'data-gn-aside-part',
                'id',
            ],
        });
    }

    manages(surface: HTMLElement): boolean {
        return Array.from(this.active).some((active) => active.surfaces.has(surface));
    }

    prepareGhost(root: HTMLElement): void {
        const surfaces = [...root.querySelectorAll<HTMLElement>(SURFACE_SELECTOR)];
        if (root.matches(SURFACE_SELECTOR)) surfaces.push(root);
        surfaces.forEach((surface) => {
            const key = surface.closest(`[${ROW_KEY}]`)?.getAttribute(ROW_KEY);
            if (
                surface.hasAttribute(SUPPRESSED) ||
                (key && Array.from(this.active).some((active) => active.rowKeys.has(key)))
            ) {
                // This copy describes an old selection. Its suppression belongs
                // to the ghost's lifetime, even after current changes in live DOM.
                surface.setAttribute(GHOST_SUPPRESSED, '');
            }
            surface.removeAttribute(SUPPRESSED);
        });
    }

    cancel(): void {
        this.active.forEach((active) => this.release(active));
        this.nativeCurrent = [];
    }

    private validate(panel: HTMLElement) {
        if (!this.active.size) return;
        const current = [...captureCurrentPresentation(panel).values()];
        const unchanged = (row: CurrentPresentation, rows: CurrentPresentation[]) =>
            rows.some(
                (other) =>
                    row.key === other.key &&
                    row.row === other.row &&
                    row.surface === other.surface &&
                    row.currentIds.length === other.currentIds.length &&
                    row.currentIds.every((id) => other.currentIds.includes(id)),
            );
        const changedSurfaces = new Set(
            [
                ...this.nativeCurrent.filter((row) => !unchanged(row, current)),
                ...current.filter((row) => !unchanged(row, this.nativeCurrent)),
            ].map(({surface}) => surface),
        );
        if (changedSurfaces.size) this.onNativePaintInvalidated?.(changedSurfaces);
        this.nativeCurrent = current;
        this.active.forEach((active) => {
            const {to} = active.transfer;
            const matches = current.filter(
                (presentation) =>
                    presentation.section === to.section &&
                    presentation.currentIds.includes(to.currentIds[0]),
            );
            const target = matches[0];
            if (
                !panel.isConnected ||
                !active.layer.isConnected ||
                !active.indicator.isConnected ||
                matches.length !== 1 ||
                target.row !== to.row ||
                target.surface !== to.surface ||
                target.key !== to.key ||
                target.currentIds.length !== 1
            ) {
                this.release(active);
            }
        });
        // Once the last transport is invalidated its observer ends too. Release
        // remaining native paint so later clicks during layout cannot be masked.
        if (!this.active.size) this.onNativePaintInvalidated?.();
    }

    private release(active: ActiveTransfer) {
        if (!this.active.delete(active)) return;
        active.surfaces.forEach((surface) => {
            if (!this.manages(surface)) surface.removeAttribute(SUPPRESSED);
        });
        active.animation.cancel();
        active.indicator.remove();
        if (!Array.from(this.active).some(({layer}) => layer === active.layer))
            active.layer.remove();
        if (!this.active.size) {
            this.observer?.disconnect();
            this.observer = undefined;
        }
    }
}
