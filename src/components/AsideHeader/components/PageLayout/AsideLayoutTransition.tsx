import React from 'react';

import {ASIDE_HEADER_COLLAPSE_TRANSITION_MS} from '../../../constants';
import {COMPOSITE_BAR_ITEM_ID_ATTRIBUTE} from '../CompositeBar/constants';

import {CurrentIndicatorTransition} from './CurrentIndicatorTransition';
import {CurrentPresentationObserver} from './CurrentPresentationObserver';
import {
    CURRENT_ROW_KEY_ATTRIBUTE,
    CURRENT_ROW_SELECTOR,
    getCompositeBarSection,
} from './currentIndicatorDom';
import {
    type CurrentIdentitySnapshot,
    type CurrentSnapshot,
    captureCurrentIdentity,
    captureCurrentPresentation,
    getCurrentRowKey,
    matchCurrentPresentations,
} from './currentIndicatorModel';

type Part = {
    element: HTMLElement;
    rect: DOMRect;
    anchor: DOMRect;
    opacity: number;
    transform: string;
    backgroundColor: string;
    borderRadius: string;
    clipPath: string;
    clipRect?: DOMRect;
};

type Row = Part & {icon?: Part; title?: Part; surface?: Part; group?: string};
type Group = {part: Part; headerKey: string};
type Divider = Part & {id: string; group?: string};
type Snapshot = {
    rows: Map<string, Row>;
    groups: Map<string, Group>;
    dividers: Map<string, Divider>;
    width: number;
    layoutWidth: number;
    current?: CurrentSnapshot;
    collapse?: {element: HTMLElement; y: number; anchor: Element | null};
};
type Props = React.HTMLAttributes<HTMLDivElement> & {
    compact: boolean;
    compactTransition?: boolean;
};

const ITEM_SELECTOR = CURRENT_ROW_SELECTOR;
const LOGO_SELECTOR = '[data-gn-aside-transition-row="logo"]';
const TITLE_SELECTOR = '[data-gn-aside-part="quick-access-title"]';

function measure(element: HTMLElement): Part {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
        element,
        rect,
        anchor: element.querySelector('svg, img')?.getBoundingClientRect() ?? rect,
        opacity: rect.width > 0 && rect.height > 0 ? Number(style.opacity) : 0,
        transform: style.transform,
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        clipPath: style.clipPath,
        clipRect: element
            .closest('[data-gn-aside-scrollport], [data-gn-aside-transition-scroll-clip]')
            ?.getBoundingClientRect(),
    };
}

function cloneAppearance(element: HTMLElement) {
    const clone = element.cloneNode(true) as HTMLElement;
    const sources = [element, ...Array.from(element.querySelectorAll<HTMLElement>('*'))];
    const copies = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>('*'))];
    sources.forEach((source, index) => {
        // A fading title leaves its row's CSS scope (for example _current).
        // Preserve computed typography/paint, but not layout: the ghost's box
        // and translation are controlled independently by the animation.
        const style = getComputedStyle(source);
        const copy = copies[index];
        if (!copy.style) return;
        const row = source.closest<HTMLElement>(ITEM_SELECTOR);
        if (row && (source === row || source.matches('[data-gn-aside-part="surface"]'))) {
            copy.setAttribute(CURRENT_ROW_KEY_ATTRIBUTE, getCurrentRowKey(row));
        }
        for (const property of [
            'color',
            'font',
            'line-height',
            'letter-spacing',
            'text-transform',
            'text-shadow',
            'text-decoration',
            // A detached group no longer inherits its inline-list row gap.
            '--_--menu-item-gap',
        ]) {
            copy.style.setProperty(property, style.getPropertyValue(property));
        }
    });
    return clone;
}

function measureRow(element: HTMLElement): Row {
    const part = (name: string) => {
        const child = element.querySelector<HTMLElement>(`[data-gn-aside-part="${name}"]`);
        return child ? measure(child) : undefined;
    };
    return {
        ...measure(element),
        icon: part('icon'),
        title: part('title'),
        surface: part('surface'),
    };
}

function capture(panel: HTMLElement): Snapshot {
    const rows = new Map<string, Row>();
    const groups = new Map<string, Group>();
    const dividers = new Map<string, Divider>();
    panel.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((element) => {
        // A quick-access copy and the main item have the same item id, but belong
        // to different composite bars. Nested items inherit their root bar's id.
        const section = getCompositeBarSection(element);
        const id = element.getAttribute(COMPOSITE_BAR_ITEM_ID_ATTRIBUTE);
        const row = measureRow(element);
        if (element.hasAttribute('data-gn-aside-nested')) {
            row.group = `${section}/${element.closest('[data-gn-aside-group]')?.getAttribute('data-gn-aside-group')}`;
        }
        rows.set(`${section}/${id}`, row);
    });
    const logo = panel.querySelector<HTMLElement>(LOGO_SELECTOR);
    if (logo) rows.set('logo', measureRow(logo));
    const title = panel.querySelector<HTMLElement>(TITLE_SELECTOR);
    if (title) rows.set('quick-access-title', measureRow(title));
    panel.querySelectorAll<HTMLElement>('[data-gn-aside-divider]').forEach((element) => {
        if (element.closest('[data-gn-aside-transition-overlay]')) return;
        const id = element.getAttribute('data-gn-aside-divider');
        const section = getCompositeBarSection(element, 'aside');
        const group = element.closest('[data-gn-aside-group]');
        if (id)
            dividers.set(`${section}/${id}`, {
                ...measure(element),
                id,
                group: group
                    ? `${section}/${group.getAttribute('data-gn-aside-group')}`
                    : undefined,
            });
    });
    panel.querySelectorAll<HTMLElement>('[data-gn-aside-group]').forEach((element) => {
        const list = element.querySelector<HTMLElement>(':scope > .g-list');
        const header = element.querySelector<HTMLElement>(ITEM_SELECTOR);
        if (!list || !header) return;
        const section = getCompositeBarSection(header);
        groups.set(`${section}/${element.getAttribute('data-gn-aside-group')}`, {
            part: measure(list),
            headerKey: `${section}/${header.getAttribute(COMPOSITE_BAR_ITEM_ID_ATTRIBUTE)}`,
        });
    });
    const width = panel.getBoundingClientRect().width;
    const layoutWidth =
        Number.parseFloat(getComputedStyle(panel).getPropertyValue('--gn-aside-header-size')) ||
        width;
    const slot = panel.nextElementSibling?.matches('[data-gn-aside-collapse-layer]')
        ? panel.nextElementSibling.querySelector<HTMLElement>('[data-gn-aside-collapse-slot]')
        : null;
    const collapse = slot
        ? {
              element: slot,
              y: slot.getBoundingClientRect().y,
              anchor: panel.querySelector('[data-gn-collapse-anchor]'),
          }
        : undefined;
    return {rows, groups, dividers, width, layoutWidth, collapse};
}

type BeforeSnapshot = Snapshot & {appearances: Map<Part, HTMLElement>};

function canCreateRowGhost(row: Row, snapshot: Snapshot): boolean {
    return row.opacity !== 0 && !(row.group && snapshot.groups.has(row.group));
}

function captureGhostAppearances(snapshot: Snapshot): Map<Part, HTMLElement> {
    const appearances = new Map<Part, HTMLElement>();
    const save = (part: Part) => appearances.set(part, cloneAppearance(part.element));
    snapshot.rows.forEach((row) => {
        if (canCreateRowGhost(row, snapshot)) save(row);
        if (row.title && row.title.opacity > 0) save(row.title);
    });
    snapshot.groups.forEach(({part}) => save(part));
    return appearances;
}

function translation(x: number, y: number, transform = 'none') {
    return `translate(${x}px, ${y}px) ${transform === 'none' ? '' : transform}`;
}

/**
 * FLIP boundary for the aside: snapshot before React mutates the DOM, then
 * translate the target rows from their old positions before the browser paints.
 * Text is never scaled and the actual target layout is present from the start.
 * Departing rows/titles are decorative, inert copies, removed on animation finish.
 */
export class AsideLayoutTransition extends React.Component<
    Props,
    Record<string, never>,
    BeforeSnapshot | null
> {
    private root = React.createRef<HTMLDivElement>();
    private currentIndicator = new CurrentIndicatorTransition(() => this.reconcileObservation());
    private currentIdentities: CurrentIdentitySnapshot = new Map();
    private presentationObserver = new CurrentPresentationObserver((identities, surfaces) => {
        const panel = this.animatedPanel;
        if (!panel) return;
        if (!panel.isConnected || !this.root.current?.contains(panel)) {
            this.cancel();
            return;
        }
        this.currentIdentities = identities;
        this.surfacePaint.forEach((_animation, surface) => {
            if (!surface.isConnected || !panel.contains(surface)) surfaces.add(surface);
        });
        this.cancelSurfacePaint(surfaces);
        this.currentIndicator.validate(panel, identities);
        this.reconcileObservation();
    });
    private animations: Animation[] = [];
    private surfacePaint = new Map<HTMLElement, Animation>();
    private overlay?: HTMLDivElement;
    private scrollOverlay?: HTMLDivElement;
    private animatedPanel?: HTMLElement;
    private departingRows = new Map<string, HTMLElement>();
    private departingTitles = new Map<string, HTMLElement>();
    private generation = 0;
    private pendingStart?: object;
    private departingGroups = new Map<string, {element: HTMLElement; headerKey: string}>();
    private departingDividers = new Map<
        string,
        {element: HTMLElement; id: string; group?: string}
    >();

    getSnapshotBeforeUpdate(previous: Props): BeforeSnapshot | null {
        if (this.props.compactTransition === false) {
            if (this.animatedPanel || this.pendingStart) this.cancel();
            return null;
        }
        if (previous.compact === this.props.compact) return null;
        const panel = this.root.current?.querySelector<HTMLElement>('[data-gn-aside-panel]');
        // A synchronous remount can precede observer delivery. Departing parts
        // belong only to their original panel and must not seed a new snapshot.
        if (
            this.animatedPanel &&
            (this.animatedPanel !== panel || !this.animatedPanel.isConnected)
        ) {
            this.cancel();
        }
        if (!panel) return null;
        const identities = captureCurrentIdentity(panel);
        this.presentationObserver.check(panel, identities, true);
        const current = this.currentIndicator.capture(panel, identities);
        // Save moving geometry first, then restore live paint before ordinary
        // snapshots. Layout effects stay alive until every reversal part is read.
        this.presentationObserver.disconnect();
        this.animatedPanel = undefined;
        this.currentIndicator.cancel();
        const snapshot = {...capture(panel), current};
        // Interrupted transitions start at their current screen coordinates,
        // including content still fading out from a previous compact toggle.
        this.departingRows.forEach((element, key) => snapshot.rows.set(key, measureRow(element)));
        this.departingTitles.forEach((element, key) => {
            const row = snapshot.rows.get(key);
            if (row) row.title = measure(element);
        });
        this.departingGroups.forEach(({element, headerKey}, key) => {
            snapshot.groups.set(key, {part: measure(element), headerKey});
        });
        this.departingDividers.forEach(({element, id, group}, key) => {
            snapshot.dividers.set(key, {...measure(element), id, group});
        });
        const before: BeforeSnapshot = {
            ...snapshot,
            appearances: captureGhostAppearances(snapshot),
        };
        this.animatedPanel = panel;
        this.cancel();
        return before;
    }

    componentDidUpdate(
        _previous: Props,
        _state: Record<string, never>,
        before: BeforeSnapshot | null,
    ) {
        if (!before) return;
        const generation = this.generation;
        const pendingStart = {};
        this.pendingStart = pendingStart;
        // AutoSizer's mount/update can synchronously enqueue another React commit.
        // Let that commit finish before reading the target rows, but still install
        // the inverse transforms in the same task, before the browser paints.
        queueMicrotask(() => {
            if (generation !== this.generation) return;
            if (this.pendingStart === pendingStart) this.pendingStart = undefined;
            if (this.root.current) this.start(before);
        });
    }

    componentWillUnmount() {
        this.cancel();
    }

    render() {
        const {compactTransition: _compactTransition, compact: _compact, ...props} = this.props;
        return <div {...props} ref={this.root} />;
    }

    private start(before: BeforeSnapshot) {
        if (this.props.compactTransition === false) return;
        const panel = this.root.current?.querySelector<HTMLElement>('[data-gn-aside-panel]');
        if (
            !panel ||
            typeof panel.animate !== 'function' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
            return;

        const after = capture(panel);
        // CSS shortens reversed transitions. Follow its actual duration rather
        // than restarting a second independent 200ms presentation timer.
        const widthTransition = panel
            .getAnimations()
            .find(
                (animation) =>
                    'transitionProperty' in animation && animation.transitionProperty === 'width',
            );
        const duration = Number(
            widthTransition?.effect?.getComputedTiming().duration ??
                ASIDE_HEADER_COLLAPSE_TRANSITION_MS,
        );
        if (duration <= 0) return;
        const generation = ++this.generation;
        panel.setAttribute('data-gn-aside-animating', '');
        this.currentIdentities = captureCurrentIdentity(panel);
        const targetCurrent = captureCurrentPresentation(panel, this.currentIdentities);
        const options: KeyframeAnimationOptions = {duration, easing: 'ease-in-out', fill: 'both'};
        this.currentIndicator.start(
            panel,
            matchCurrentPresentations(before.current ?? new Map(), targetCurrent),
            options,
            widthTransition?.startTime ?? null,
        );
        const animate = (element: HTMLElement, keyframes: Keyframe[]) => {
            const animation = element.animate(keyframes, options);
            if (widthTransition?.startTime !== null && widthTransition?.startTime !== undefined) {
                animation.startTime = widthTransition.startTime;
            }
            this.animations.push(animation);
            return animation;
        };

        if (
            before.collapse &&
            after.collapse &&
            before.collapse.element === after.collapse.element &&
            before.collapse.anchor === after.collapse.anchor
        ) {
            animate(after.collapse.element, [
                {transform: `translateY(${before.collapse.y - after.collapse.y}px)`},
                {transform: 'none'},
            ]);
        }

        after.rows.forEach((row, key) => {
            if (row.group && after.groups.has(row.group)) return;
            const old = before.rows.get(key);
            if (!old) {
                animate(row.element, [{opacity: 0}, {opacity: row.opacity}]);
                return;
            }
            animate(row.element, [
                {
                    transform: translation(
                        old.rect.x - row.rect.x,
                        old.rect.y - row.rect.y,
                        row.transform,
                    ),
                    opacity: old.opacity,
                },
                {transform: row.transform, opacity: row.opacity},
            ]);
            if (old.icon && row.icon) {
                // Keep the icon's centre continuous even for action rows and
                // two-line titles, whose icon slots differ between layouts.
                const dx =
                    old.icon.anchor.x +
                    old.icon.anchor.width / 2 -
                    old.rect.x -
                    (row.icon.anchor.x + row.icon.anchor.width / 2 - row.rect.x);
                const dy =
                    old.icon.anchor.y +
                    old.icon.anchor.height / 2 -
                    old.rect.y -
                    (row.icon.anchor.y + row.icon.anchor.height / 2 - row.rect.y);
                animate(row.icon.element, [{transform: translation(dx, dy)}, {transform: 'none'}]);
            }
            if (row.title && row.title.opacity > 0) {
                const dx = old.title?.opacity
                    ? old.title.rect.x - old.rect.x - (row.title.rect.x - row.rect.x)
                    : 0;
                const dy = old.title?.opacity
                    ? old.title.rect.y - old.rect.y - (row.title.rect.y - row.rect.y)
                    : 0;
                animate(row.title.element, [
                    {opacity: old.title?.opacity ?? 0, transform: translation(dx, dy)},
                    {opacity: row.title.opacity, transform: 'none'},
                ]);
            } else if (old.title && old.title.opacity > 0) {
                const ghost = this.addGhost(panel, old.title, before.appearances);
                if (ghost) {
                    this.departingTitles.set(key, ghost);
                    animate(ghost, [
                        {opacity: old.title.opacity, transform: 'none'},
                        {
                            opacity: 0,
                            transform: translation(
                                row.rect.x - old.rect.x,
                                row.rect.y - old.rect.y,
                            ),
                        },
                    ]);
                }
            }
            if (old.surface && row.surface) {
                const surface = row.surface;
                const dx = old.surface.rect.x - old.rect.x - (surface.rect.x - row.rect.x);
                const dy = old.surface.rect.y - old.rect.y - (surface.rect.y - row.rect.y);
                animate(surface.element, [
                    {
                        transform: translation(dx, dy),
                        width: `${old.surface.rect.width}px`,
                        height: `${old.surface.rect.height}px`,
                        borderRadius: old.surface.borderRadius,
                    },
                    {
                        transform: 'none',
                        width: `${surface.rect.width}px`,
                        height: `${surface.rect.height}px`,
                        borderRadius: surface.borderRadius,
                    },
                ]);
                if (
                    !this.currentIndicator.manages(surface.element) &&
                    old.surface.backgroundColor !== surface.backgroundColor
                ) {
                    const animation = animate(surface.element, [
                        {backgroundColor: old.surface.backgroundColor},
                        {backgroundColor: surface.backgroundColor},
                    ]);
                    this.surfacePaint.set(surface.element, animation);
                    const settled = () => {
                        if (
                            this.generation !== generation ||
                            this.surfacePaint.get(surface.element) !== animation
                        )
                            return;
                        // A finished fill:'both' effect still overrides native
                        // current/hover CSS until it is explicitly released.
                        this.cancelSurfacePaint(new Set([surface.element]));
                        this.reconcileObservation();
                    };
                    animation.finished.then(settled, settled);
                }
            }
        });
        before.rows.forEach((row, key) => {
            if (after.rows.has(key) || !canCreateRowGhost(row, before)) return;
            const ghost = this.addGhost(panel, row, before.appearances);
            if (!ghost) return;
            this.departingRows.set(key, ghost);
            animate(ghost, [{opacity: row.opacity}, {opacity: 0}]);
        });

        after.dividers.forEach((divider, key) => {
            const old = before.dividers.get(key);
            const oldGroup = divider.group ? before.groups.get(divider.group) : undefined;
            const newGroup = divider.group ? after.groups.get(divider.group) : undefined;
            // Nested lines inherit their group's translation; only compensate
            // for changes within that group, not its full screen movement twice.
            const dx = old ? old.rect.x - divider.rect.x : 0;
            const dy = old ? old.rect.y - divider.rect.y : 0;
            const groupDx = oldGroup && newGroup ? oldGroup.part.rect.x - newGroup.part.rect.x : dx;
            const groupDy = oldGroup && newGroup ? oldGroup.part.rect.y - newGroup.part.rect.y : dy;
            // Lines resize with the outer edge while text retains its target
            // layout. Keep footer overflow opacity independent of this motion.
            animate(divider.element, [
                {
                    transform: translation(
                        dx - (newGroup ? groupDx : 0),
                        dy - (newGroup ? groupDy : 0),
                        divider.transform,
                    ),
                    width: `${old?.rect.width ?? Math.max(0, divider.rect.width + before.width - after.layoutWidth)}px`,
                },
                {transform: divider.transform, width: `${divider.rect.width}px`},
            ]);
        });

        const openClip = 'inset(0px 0px 0px 0px)';
        const closedClip = 'inset(0px 0px 100% 0px)';
        after.groups.forEach((group, key) => {
            const old = before.groups.get(key);
            const oldHeader = before.rows.get(group.headerKey);
            const header = after.rows.get(group.headerKey);
            let dx = 0;
            let dy = 0;
            if (old) {
                dx = old.part.rect.x - group.part.rect.x;
                dy = old.part.rect.y - group.part.rect.y;
            } else if (oldHeader && header) {
                dx = oldHeader.rect.x - header.rect.x;
                dy = oldHeader.rect.y - header.rect.y;
            }
            animate(group.part.element, [
                {transform: translation(dx, dy), clipPath: old ? old.part.clipPath : closedClip},
                {transform: 'none', clipPath: openClip},
            ]);
        });
        before.groups.forEach((group, key) => {
            if (after.groups.has(key)) return;
            const ghost = this.addGhost(panel, group.part, before.appearances);
            if (!ghost) return;
            this.departingGroups.set(key, {element: ghost, headerKey: group.headerKey});
            // Departing groups are decorative clones, but their dividers still
            // resize with the aside. Retain keyed geometry for a mid-flight reversal.
            before.dividers.forEach((divider, dividerKey) => {
                if (divider.group !== key) return;
                const line = Array.from(
                    ghost.querySelectorAll<HTMLElement>('[data-gn-aside-divider]'),
                ).find((element) => element.getAttribute('data-gn-aside-divider') === divider.id);
                if (!line) return;
                this.departingDividers.set(dividerKey, {element: line, id: divider.id, group: key});
                animate(line, [
                    {width: `${divider.rect.width}px`},
                    {
                        width: `${Math.max(0, divider.rect.width + after.layoutWidth - before.width)}px`,
                    },
                ]);
            });
            const oldHeader = before.rows.get(group.headerKey);
            const header = after.rows.get(group.headerKey);
            const dx = oldHeader && header ? header.rect.x - oldHeader.rect.x : 0;
            const dy = oldHeader && header ? header.rect.y - oldHeader.rect.y : 0;
            animate(ghost, [
                {
                    transform: 'none',
                    clipPath: group.part.clipPath === 'none' ? openClip : group.part.clipPath,
                },
                {transform: translation(dx, dy), clipPath: closedClip},
            ]);
        });

        this.animatedPanel = panel;
        this.reconcileObservation();
        Promise.all(
            this.animations.map((animation) => animation.finished.catch(() => undefined)),
        ).then(() => {
            if (this.generation === generation) this.cancel();
        });
    }

    private addGhost(
        panel: HTMLElement,
        part: Part,
        appearances: Map<Part, HTMLElement>,
    ): HTMLElement | undefined {
        const ghost = appearances.get(part);
        if (!ghost) {
            if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.error('Missing pre-update aside ghost appearance');
            }
            return undefined;
        }
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.setAttribute('aria-hidden', 'true');
            this.overlay.setAttribute('inert', '');
            this.overlay.setAttribute('data-gn-aside-transition-overlay', '');
            Object.assign(this.overlay.style, {
                position: 'absolute',
                inset: '0',
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: '4',
            });
            panel.appendChild(this.overlay);
        }
        this.currentIndicator.prepareGhost(ghost);
        [ghost, ...Array.from(ghost.querySelectorAll<HTMLElement>('*'))].forEach((element) => {
            element.removeAttribute('id');
            element.removeAttribute('data-qa');
            element.removeAttribute('data-gn-collapse-anchor');
            element.removeAttribute(COMPOSITE_BAR_ITEM_ID_ATTRIBUTE);
        });
        const origin = panel.getBoundingClientRect();
        let parent = this.overlay;
        let top = origin.y;
        if (part.clipRect) {
            const viewport = panel
                .querySelector('[data-gn-aside-scrollport]')
                ?.getBoundingClientRect();
            const clipTop = Math.max(part.clipRect.top, viewport?.top ?? part.clipRect.top);
            const clipBottom = Math.min(
                part.clipRect.bottom,
                viewport?.bottom ?? part.clipRect.bottom,
            );
            if (!this.scrollOverlay) {
                this.scrollOverlay = document.createElement('div');
                this.scrollOverlay.setAttribute('data-gn-aside-transition-scroll-clip', '');
                Object.assign(this.scrollOverlay.style, {
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    top: `${clipTop - origin.y}px`,
                    height: `${Math.max(0, clipBottom - clipTop)}px`,
                    overflow: 'hidden',
                });
                this.overlay.appendChild(this.scrollOverlay);
            }
            parent = this.scrollOverlay;
            top = parent.getBoundingClientRect().y;
        }
        Object.assign(ghost.style, {
            position: 'absolute',
            margin: '0',
            boxSizing: 'border-box',
            left: `${part.rect.x - origin.x}px`,
            top: `${part.rect.y - top}px`,
            width: `${part.rect.width}px`,
            height: `${part.rect.height}px`,
            transform: 'none',
        });
        parent.appendChild(ghost);
        return ghost;
    }

    private cancel() {
        this.presentationObserver.disconnect();
        this.pendingStart = undefined;
        this.generation++;
        this.animatedPanel?.removeAttribute('data-gn-aside-animating');
        this.animatedPanel = undefined;
        this.currentIndicator.cancel();
        this.animations.forEach((animation) => animation.cancel());
        this.animations = [];
        this.surfacePaint.clear();
        this.currentIdentities.clear();
        this.overlay?.remove();
        this.overlay = undefined;
        this.scrollOverlay = undefined;
        this.departingRows.clear();
        this.departingTitles.clear();
        this.departingGroups.clear();
        this.departingDividers.clear();
    }

    private cancelSurfacePaint(surfaces: Set<HTMLElement>) {
        const cancelled = new Set<Animation>();
        this.surfacePaint.forEach((animation, surface) => {
            if (!surfaces.has(surface)) return;
            animation.cancel();
            cancelled.add(animation);
            this.surfacePaint.delete(surface);
        });
        this.animations = this.animations.filter((animation) => !cancelled.has(animation));
    }

    private reconcileObservation() {
        if (
            this.animatedPanel &&
            (this.currentIndicator.hasActiveTransfers || this.surfacePaint.size > 0)
        ) {
            this.presentationObserver.observe(this.animatedPanel, this.currentIdentities);
        } else {
            this.presentationObserver.disconnect();
        }
    }
}
