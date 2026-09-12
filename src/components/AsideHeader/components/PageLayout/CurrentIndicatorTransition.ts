import {
    CURRENT_GHOST_SUPPRESSED_ATTRIBUTE,
    CURRENT_ROW_KEY_ATTRIBUTE,
    CURRENT_ROW_SELECTOR,
    CURRENT_SUPPRESSED_ATTRIBUTE,
    SURFACE_SELECTOR,
} from './currentIndicatorDom';
import {
    type CurrentIdentitySnapshot,
    type CurrentSnapshot,
    type CurrentTransfer,
    captureCurrentIdentity,
    captureCurrentPresentation,
    getCurrentRowKey,
} from './currentIndicatorModel';

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
    private onTransfersChanged?: () => void;

    constructor(onTransfersChanged?: () => void) {
        this.onTransfersChanged = onTransfersChanged;
    }

    get hasActiveTransfers(): boolean {
        return this.active.size > 0;
    }

    capture(panel: HTMLElement, identities = captureCurrentIdentity(panel)): CurrentSnapshot {
        // A parent can change current and compact in one task, before observer
        // delivery. Restore invalid transfers before reading native paint.
        this.validate(panel, identities);
        const snapshot = captureCurrentPresentation(panel, identities);
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
        const layers = new Map<HTMLElement, HTMLElement>();
        transfers.forEach((transfer) => {
            const {from, to} = transfer;
            const host = to.row.closest<HTMLElement>('[data-gn-aside-current-container]');
            // Built-in header/footer rows never change representative and have
            // no scroll-content indicator container to transport within.
            if (!host || typeof host.animate !== 'function') return;
            const hostRect = host.getBoundingClientRect();
            const scrollRect = host.closest('[data-gn-aside-scrollport]')?.getBoundingClientRect();
            const layerLeft = (scrollRect?.left ?? hostRect.left) - hostRect.left;
            const layerWidth =
                (scrollRect?.right ?? hostRect.right) - (scrollRect?.left ?? hostRect.left);
            let layer = layers.get(host);
            if (!layer) {
                layer = document.createElement('div');
                layer.setAttribute('data-gn-aside-current-indicator-layer', '');
                layer.setAttribute('aria-hidden', 'true');
                layer.setAttribute('inert', '');
                Object.assign(layer.style, {
                    position: 'absolute',
                    insetBlock: '0',
                    left: `${layerLeft}px`,
                    width: `${Math.max(0, layerWidth)}px`,
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
                left: `${presentation.rect.left - hostRect.left - layerLeft}px`,
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
                    surface.setAttribute(CURRENT_SUPPRESSED_ATTRIBUTE, '');
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
        if (this.active.size) this.onTransfersChanged?.();
    }

    manages(surface: HTMLElement): boolean {
        return Array.from(this.active).some((active) => active.surfaces.has(surface));
    }

    prepareGhost(root: HTMLElement): void {
        const surfaces = [...root.querySelectorAll<HTMLElement>(SURFACE_SELECTOR)];
        surfaces.forEach((surface) => {
            const key = surface
                .closest(`[${CURRENT_ROW_KEY_ATTRIBUTE}]`)
                ?.getAttribute(CURRENT_ROW_KEY_ATTRIBUTE);
            if (
                surface.hasAttribute(CURRENT_SUPPRESSED_ATTRIBUTE) ||
                (key && Array.from(this.active).some((active) => active.rowKeys.has(key)))
            ) {
                // This copy describes an old selection. Its suppression belongs
                // to the ghost's lifetime, even after current changes in live DOM.
                surface.setAttribute(CURRENT_GHOST_SUPPRESSED_ATTRIBUTE, '');
            }
            surface.removeAttribute(CURRENT_SUPPRESSED_ATTRIBUTE);
        });
    }

    cancel(): void {
        this.active.forEach((active) => this.release(active));
    }

    validate(panel: HTMLElement, identities: CurrentIdentitySnapshot): void {
        if (!this.active.size) return;
        const counts = new Map<string, number>();
        identities.forEach(({section, currentIds}) => {
            currentIds.forEach((id) => {
                const key = JSON.stringify([section, id]);
                counts.set(key, (counts.get(key) ?? 0) + 1);
            });
        });
        this.active.forEach((active) => {
            const {to} = active.transfer;
            const target = identities.get(to.row);
            if (
                !panel.isConnected ||
                !active.layer.isConnected ||
                !active.indicator.isConnected ||
                counts.get(JSON.stringify([to.section, to.currentIds[0]])) !== 1 ||
                !target ||
                target.currentIds[0] !== to.currentIds[0] ||
                target.surface !== to.surface ||
                target.key !== to.key ||
                target.currentIds.length !== 1
            ) {
                this.release(active);
            }
        });
    }

    private release(active: ActiveTransfer) {
        if (!this.active.delete(active)) return;
        active.surfaces.forEach((surface) => {
            if (!this.manages(surface)) surface.removeAttribute(CURRENT_SUPPRESSED_ATTRIBUTE);
        });
        active.animation.cancel();
        active.indicator.remove();
        if (!Array.from(this.active).some(({layer}) => layer === active.layer))
            active.layer.remove();
        this.onTransfersChanged?.();
    }
}
