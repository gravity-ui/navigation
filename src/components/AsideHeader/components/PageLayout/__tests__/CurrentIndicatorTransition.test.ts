/** @jest-environment jsdom */
import {CurrentIndicatorTransition} from '../CurrentIndicatorTransition';
import {
    captureCurrentPresentation,
    getCurrentRowKey,
    matchCurrentPresentations,
} from '../currentIndicatorModel';

const marker = '[data-gn-aside-current-indicator]';
const suppressed = 'data-gn-aside-current-suppressed';
const flush = async () => {
    await Promise.resolve();
    await Promise.resolve();
};

describe('CurrentIndicatorTransition lifecycle', () => {
    let boundary: HTMLElement;
    let panel: HTMLElement;
    let host: HTMLElement;
    let section: HTMLElement;
    let controller: CurrentIndicatorTransition;
    let handles: {
        resolve: () => void;
        cancel: jest.Mock;
        frames: Keyframe[];
        animation: Animation;
    }[];
    const originalAnimate = HTMLElement.prototype.animate;

    function row(id: string, current = true) {
        const element = document.createElement('div');
        element.setAttribute('data-gn-composite-bar-item-id', id);
        element.setAttribute(
            'data-gn-aside-current-ids',
            JSON.stringify(current ? ['weekly'] : []),
        );
        const surface = document.createElement('span');
        surface.setAttribute('data-gn-aside-part', 'surface');
        surface.style.backgroundColor = 'rgb(0, 0, 255)';
        surface.style.borderRadius = '8px';
        surface.getBoundingClientRect = () => new DOMRect(20, id === 'weekly' ? 100 : 60, 80, 30);
        element.append(surface);
        section.append(element);
        return {element, surface};
    }

    function start() {
        const source = row('weekly');
        const before = controller.capture(panel);
        source.element.setAttribute('data-gn-aside-current-ids', '[]');
        const target = row('analytics');
        const transfers = matchCurrentPresentations(before, captureCurrentPresentation(panel));
        controller.start(panel, transfers, {duration: 200, fill: 'both'}, 12);
        return {source, target};
    }

    beforeEach(() => {
        boundary = document.createElement('div');
        panel = document.createElement('div');
        host = document.createElement('div');
        host.setAttribute('data-gn-aside-current-container', '');
        host.getBoundingClientRect = () => new DOMRect(10, 40, 100, 300);
        section = document.createElement('div');
        section.id = 'gravity-ui/navigation-menu-items-composite-bar';
        host.append(section);
        panel.append(host);
        boundary.append(panel);
        document.body.append(boundary);
        controller = new CurrentIndicatorTransition(() => boundary);
        handles = [];
        HTMLElement.prototype.animate = jest.fn((frames) => {
            let resolve = () => {};
            const finished = new Promise<void>((done) => {
                resolve = done;
            });
            const cancel = jest.fn();
            const animation = {finished, cancel, startTime: null} as unknown as Animation;
            handles.push({resolve, cancel, frames: frames as Keyframe[], animation});
            return animation;
        });
    });

    afterEach(() => {
        controller.cancel();
        boundary.remove();
        HTMLElement.prototype.animate = originalAnimate;
    });

    it('transports one rectangle and suppresses both participating live surfaces', () => {
        const {source, target} = start();
        expect(panel.querySelectorAll(marker)).toHaveLength(1);
        expect(source.surface.hasAttribute(suppressed)).toBe(true);
        expect(target.surface.hasAttribute(suppressed)).toBe(true);
        expect(controller.manages(source.surface)).toBe(true);
        expect(handles[0].frames[0]).toMatchObject({
            left: '10px',
            top: '60px',
            width: '80px',
            height: '30px',
        });
        expect(handles[0].animation.startTime).toBe(12);
    });

    it('captures moving geometry before cancellation and continues a same-row reversal', () => {
        start();
        const indicator = panel.querySelector<HTMLElement>(marker);
        expect(indicator).not.toBeNull();
        if (!indicator) throw new Error('Missing moving indicator');
        indicator.getBoundingClientRect = () => new DOMRect(30, 75, 65, 32);
        const moving = controller.capture(panel);
        controller.cancel();
        const transfer = matchCurrentPresentations(moving, captureCurrentPresentation(panel));
        expect(transfer).toHaveLength(1);
        expect(transfer[0].from.rect.y).toBe(75);
        expect(transfer[0].from.rect.width).toBe(65);
    });

    it('ignores stale completion after a new generation starts', async () => {
        const {target} = start();
        const old = handles[0];
        controller.cancel();
        target.element.remove();
        section.replaceChildren();
        start();
        old.resolve();
        await flush();
        expect(panel.querySelectorAll(marker)).toHaveLength(1);
    });

    it('does not attribute an old moving rectangle to a synchronously changed current', () => {
        const {target} = start();
        target.element.setAttribute('data-gn-aside-current-ids', '["home"]');
        const snapshot = [...controller.capture(panel).values()];
        expect(snapshot[0].inFlight).toBeUndefined();
        expect(target.surface.hasAttribute(suppressed)).toBe(false);
    });

    it('releases changed native paint and remaining paint when the last transport is invalidated', async () => {
        const invalidations: (Set<HTMLElement> | undefined)[] = [];
        controller = new CurrentIndicatorTransition(
            () => boundary,
            (surfaces) => invalidations.push(surfaces),
        );
        const home = row('home', false);
        const {target} = start();
        await flush();
        expect(invalidations).toHaveLength(0);
        target.element.setAttribute('data-gn-aside-current-ids', '[]');
        home.element.setAttribute('data-gn-aside-current-ids', '["home"]');
        await flush();
        expect(invalidations).toHaveLength(2);
        expect(invalidations[0]?.has(home.surface)).toBe(true);
        expect(invalidations[0]?.has(target.surface)).toBe(true);
        expect(invalidations[1]).toBeUndefined();
    });

    it('cancels one ambiguous transfer without removing another in the same layer', async () => {
        const invalidations: (Set<HTMLElement> | undefined)[] = [];
        controller = new CurrentIndicatorTransition(
            () => boundary,
            (surfaces) => invalidations.push(surfaces),
        );
        const source = row('weekly');
        const otherSource = row('other');
        otherSource.element.setAttribute('data-gn-aside-current-ids', '["other"]');
        const before = controller.capture(panel);
        source.element.setAttribute('data-gn-aside-current-ids', '[]');
        otherSource.element.setAttribute('data-gn-aside-current-ids', '[]');
        const target = row('analytics');
        const otherTarget = row('other-group');
        otherTarget.element.setAttribute('data-gn-aside-current-ids', '["other"]');
        controller.start(
            panel,
            matchCurrentPresentations(before, captureCurrentPresentation(panel)),
            {duration: 200},
            null,
        );
        expect(panel.querySelectorAll(marker)).toHaveLength(2);
        row('ambiguous');
        await flush();
        expect(panel.querySelectorAll(marker)).toHaveLength(1);
        expect(target.surface.hasAttribute(suppressed)).toBe(false);
        expect(otherTarget.surface.hasAttribute(suppressed)).toBe(true);
        expect(panel.querySelectorAll('[data-gn-aside-current-indicator-layer]')).toHaveLength(1);
        expect(invalidations).toHaveLength(1);
        expect(invalidations[0]?.has(otherTarget.surface)).toBe(false);
    });

    it('cancels only transport on child current changes and retains ghost suppression', async () => {
        const {source, target} = start();
        const overlay = document.createElement('div');
        overlay.setAttribute('data-gn-aside-transition-overlay', '');
        const ghost = source.element.cloneNode(true) as HTMLElement;
        ghost.setAttribute('data-gn-aside-current-row-key', getCurrentRowKey(source.element));
        controller.prepareGhost(ghost);
        overlay.append(ghost);
        panel.append(overlay);
        target.element.setAttribute('data-gn-aside-current-ids', '["home"]');
        await flush();
        expect(panel.querySelectorAll(marker)).toHaveLength(0);
        expect(target.surface.hasAttribute(suppressed)).toBe(false);
        expect(overlay.isConnected).toBe(true);
        expect(ghost.querySelector('[data-gn-aside-current-ghost-suppressed]')).not.toBeNull();
    });

    it.each(['row', 'surface', 'panel'])(
        'cancels when the target %s is replaced with equal metadata',
        async (kind) => {
            const {target} = start();
            const old = {row: target.element, surface: target.surface, panel}[kind];
            if (!old) throw new Error('Unknown replacement target');
            old.replaceWith(old.cloneNode(true));
            await flush();
            expect(handles[0].cancel).toHaveBeenCalledTimes(1);
            expect(target.surface.hasAttribute(suppressed)).toBe(false);
        },
    );

    it('ignores equal metadata, style updates, unrelated children, and its own layer mutations', async () => {
        const {target} = start();
        target.element.setAttribute('data-gn-aside-current-ids', '["weekly"]');
        target.surface.style.color = 'red';
        section.append(document.createElement('span'));
        await flush();
        expect(panel.querySelectorAll(marker)).toHaveLength(1);
        expect(handles[0].cancel).not.toHaveBeenCalled();
    });

    it('releases native surfaces and disconnects on completion and unmount', async () => {
        const disconnect = jest.spyOn(MutationObserver.prototype, 'disconnect');
        const {target} = start();
        handles[0].resolve();
        await flush();
        expect(panel.querySelectorAll(marker)).toHaveLength(0);
        expect(target.surface.hasAttribute(suppressed)).toBe(false);
        expect(disconnect).toHaveBeenCalled();
        section.replaceChildren();
        const next = start();
        controller.cancel();
        expect(next.target.surface.hasAttribute(suppressed)).toBe(false);
        expect(disconnect).toHaveBeenCalledTimes(2);
        disconnect.mockRestore();
    });
});
