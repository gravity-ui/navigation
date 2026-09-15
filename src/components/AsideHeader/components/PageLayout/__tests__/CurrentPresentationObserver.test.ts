/** @jest-environment jsdom */
import {CurrentPresentationObserver} from '../CurrentPresentationObserver';
import {captureCurrentIdentity} from '../currentIndicatorModel';

const flush = async () => {
    await Promise.resolve();
    await Promise.resolve();
};

describe('current presentation observation', () => {
    let boundary: HTMLElement;
    let panel: HTMLElement;
    let section: HTMLElement;
    let target: HTMLElement;
    let surface: HTMLElement;
    let callback: jest.Mock;
    let observer: CurrentPresentationObserver;

    beforeEach(() => {
        boundary = document.createElement('div');
        panel = document.createElement('div');
        panel.setAttribute('data-gn-aside-current-container', '');
        section = document.createElement('div');
        section.id = 'gravity-ui/navigation-menu-items-composite-bar';
        target = document.createElement('div');
        target.setAttribute('data-gn-composite-bar-item-id', 'weekly');
        target.setAttribute('data-gn-aside-current-ids', '["weekly"]');
        surface = document.createElement('span');
        surface.setAttribute('data-gn-aside-part', 'surface');
        surface.getBoundingClientRect = () => new DOMRect(10, 20, 100, 40);
        target.append(surface);
        section.append(target);
        panel.append(section);
        boundary.append(panel);
        document.body.append(boundary);
        callback = jest.fn();
        observer = new CurrentPresentationObserver(callback);
        target.setAttribute('data-gn-composite-bar-item-id', 'analytics');
        observer.observe(panel, captureCurrentIdentity(panel));
    });
    afterEach(() => {
        observer.disconnect();
        boundary.remove();
        jest.restoreAllMocks();
    });

    it('does not capture identities for unrelated content or sibling child mutations', async () => {
        const content = document.createElement('div');
        boundary.append(content);
        await flush();
        const capture = jest.spyOn(panel, 'querySelectorAll');
        content.append(document.createElement('span'));
        boundary.append(document.createElement('aside'));
        await flush();
        expect(capture).not.toHaveBeenCalled();
        expect(callback).not.toHaveBeenCalled();
    });

    it('validates semantic changes without geometry or style reads', async () => {
        const geometry = jest.spyOn(surface, 'getBoundingClientRect');
        const style = jest.spyOn(window, 'getComputedStyle');
        target.setAttribute('data-gn-aside-current-ids', '["reports"]');
        await flush();
        expect(callback).toHaveBeenCalled();
        expect(geometry).not.toHaveBeenCalled();
        expect(style).not.toHaveBeenCalled();
    });

    it.each(['row', 'surface', 'panel'])('reports equal-metadata %s replacement', async (kind) => {
        const element = {row: target, surface, panel}[kind];
        if (!element) throw new Error('Unknown replacement');
        element.replaceWith(element.cloneNode(true));
        await flush();
        expect(callback).toHaveBeenCalled();
    });

    it('ignores equal IDs and nonidentity style changes', async () => {
        target.setAttribute('data-gn-aside-current-ids', '["weekly"]');
        surface.style.color = 'red';
        await flush();
        expect(callback).not.toHaveBeenCalled();
    });

    it('ignores stale observer delivery after observing the same panel again', () => {
        observer.disconnect();
        const callbacks: MutationCallback[] = [];
        jest.spyOn(window, 'MutationObserver').mockImplementation((onMutation) => {
            callbacks.push(onMutation);
            return {observe: jest.fn(), disconnect: jest.fn(), takeRecords: () => []};
        });
        observer.observe(panel, captureCurrentIdentity(panel));
        observer.disconnect();
        observer.observe(panel, captureCurrentIdentity(panel));
        target.setAttribute('data-gn-aside-current-ids', '["reports"]');
        callbacks[0](
            [{type: 'attributes', target} as unknown as MutationRecord],
            {} as MutationObserver,
        );
        expect(callback).not.toHaveBeenCalled();
    });
});
