/** @jest-environment jsdom */
import React from 'react';

import {act, fireEvent, render, screen} from '@testing-library/react';

import {AsideLayoutTransition} from '../AsideLayoutTransition';

const {flushSync} = jest.requireActual<{flushSync: (callback: () => void) => void}>('react-dom');

describe('AsideLayoutTransition lifecycle', () => {
    it('morphs a root row when its UIKit wrapper index changes', async () => {
        const originalAnimate = HTMLElement.prototype.animate;
        const originalGetAnimations = HTMLElement.prototype.getAnimations;
        const originalRect = HTMLElement.prototype.getBoundingClientRect;
        const originalMatchMedia = window.matchMedia;
        const handles: {element: HTMLElement; frames: Keyframe[]}[] = [];
        HTMLElement.prototype.animate = function (frames) {
            handles.push({element: this, frames: frames as Keyframe[]});
            return {
                finished: new Promise(() => {}),
                cancel: jest.fn(),
            } as unknown as Animation;
        };
        HTMLElement.prototype.getAnimations = () => [];
        HTMLElement.prototype.getBoundingClientRect = function () {
            return this.id.endsWith('item-1')
                ? new DOMRect(30, 40, 100, 40)
                : new DOMRect(10, 20, 100, 40);
        };
        window.matchMedia = jest.fn().mockReturnValue({matches: false});
        const view = (compact: boolean) => (
            <AsideLayoutTransition compact={compact}>
                <div data-gn-aside-panel>
                    <div id="gravity-ui/navigation-menu-items-composite-bar">
                        <div
                            id={`gravity-ui/navigation-menu-items-composite-bar-item-${compact ? 1 : 0}`}
                        >
                            <button data-gn-composite-bar-item-id="home">Home</button>
                        </div>
                    </div>
                </div>
            </AsideLayoutTransition>
        );
        const {rerender, unmount} = render(view(false));
        try {
            rerender(view(true));
            await act(async () => {
                await Promise.resolve();
            });
            const row = screen.getByRole('button', {name: 'Home'});
            const rowAnimations = handles.filter(({element}) => element === row);
            expect(rowAnimations).toHaveLength(1);
            expect(rowAnimations[0].frames).toEqual([
                expect.objectContaining({transform: expect.stringContaining('translate(')}),
                expect.objectContaining({transform: expect.any(String)}),
            ]);
        } finally {
            unmount();
            HTMLElement.prototype.animate = originalAnimate;
            HTMLElement.prototype.getAnimations = originalGetAnimations;
            HTMLElement.prototype.getBoundingClientRect = originalRect;
            window.matchMedia = originalMatchMedia;
        }
    });

    it('releases native paint independently from geometry when current changes during transport', async () => {
        const originalAnimate = HTMLElement.prototype.animate;
        const originalGetAnimations = HTMLElement.prototype.getAnimations;
        const originalRect = HTMLElement.prototype.getBoundingClientRect;
        const originalMatchMedia = window.matchMedia;
        const handles: {element: HTMLElement; frames: Keyframe[]; cancel: jest.Mock}[] = [];
        HTMLElement.prototype.animate = function (frames) {
            const cancel = jest.fn();
            handles.push({element: this, frames: frames as Keyframe[], cancel});
            return {finished: new Promise(() => {}), cancel} as unknown as Animation;
        };
        HTMLElement.prototype.getAnimations = () => [];
        HTMLElement.prototype.getBoundingClientRect = () => new DOMRect(10, 20, 100, 40);
        window.matchMedia = jest.fn().mockReturnValue({matches: false});
        // Decorative WAAPI targets and layers deliberately have no accessible role.
        // eslint-disable-next-line testing-library/no-node-access
        const findDecoration = (selector: string) => document.querySelector(selector);
        function Menu({compact}: {compact: boolean}) {
            const [current, setCurrent] = React.useState('weekly');
            const homeColor = compact ? 'transparent' : 'gray';
            const row = (id: string, selected: boolean, color: string) => (
                <div
                    style={{opacity: 1}}
                    data-gn-composite-bar-item-id={id}
                    data-gn-aside-current-ids={JSON.stringify(selected ? [current] : [])}
                >
                    <span data-gn-aside-part="surface" style={{backgroundColor: color}} />
                </div>
            );
            return (
                <div data-gn-aside-panel>
                    <div data-gn-aside-current-container>
                        <div id="gravity-ui/navigation-menu-items-composite-bar">
                            {row(
                                'home',
                                current === 'home',
                                current === 'home' ? 'blue' : homeColor,
                            )}
                            {row(
                                'analytics',
                                compact && current === 'weekly',
                                compact && current === 'weekly' ? 'blue' : 'transparent',
                            )}
                            {!compact && row('weekly', current === 'weekly', 'blue')}
                        </div>
                    </div>
                    <button onClick={() => setCurrent('home')}>Change current</button>
                </div>
            );
        }
        const view = (compact: boolean) => (
            <AsideLayoutTransition compact={compact}>
                <Menu compact={compact} />
            </AsideLayoutTransition>
        );
        const {rerender, unmount} = render(view(false));
        try {
            rerender(view(true));
            await act(async () => {
                await Promise.resolve();
            });
            const home = findDecoration(
                '[data-gn-composite-bar-item-id="home"] [data-gn-aside-part="surface"]',
            );
            const paint = handles.find(
                ({element, frames}) =>
                    element === home && frames.some((frame) => 'backgroundColor' in frame),
            );
            const geometry = handles.find(
                ({element, frames}) => element === home && frames.some((frame) => 'width' in frame),
            );
            expect(paint).toBeDefined();
            expect(geometry).toBeDefined();
            fireEvent.click(screen.getByRole('button', {name: 'Change current'}));
            await act(async () => {
                await Promise.resolve();
            });
            expect(paint?.cancel).toHaveBeenCalledTimes(1);
            expect(geometry?.cancel).not.toHaveBeenCalled();
            expect(findDecoration('[data-gn-aside-current-indicator]')).toBeNull();
            expect(findDecoration('[data-gn-aside-transition-overlay]')).not.toBeNull();
            expect(findDecoration('[data-gn-aside-animating]')).not.toBeNull();
        } finally {
            unmount();
            HTMLElement.prototype.animate = originalAnimate;
            HTMLElement.prototype.getAnimations = originalGetAnimations;
            HTMLElement.prototype.getBoundingClientRect = originalRect;
            window.matchMedia = originalMatchMedia;
        }
    });

    it('cancels interrupted animations and releases animations on unmount', async () => {
        const originalAnimate = HTMLElement.prototype.animate;
        const originalGetAnimations = HTMLElement.prototype.getAnimations;
        const originalMatchMedia = window.matchMedia;
        const handles: {cancel: jest.Mock; resolve: () => void}[] = [];
        HTMLElement.prototype.animate = jest.fn(() => {
            let resolve = () => {};
            const finished = new Promise<void>((done) => {
                resolve = done;
            });
            const handle = {cancel: jest.fn(), resolve};
            handles.push(handle);
            return {finished, cancel: handle.cancel} as unknown as Animation;
        });
        HTMLElement.prototype.getAnimations = () => [];
        window.matchMedia = jest.fn().mockReturnValue({matches: false});
        const view = (compact: boolean) => (
            <AsideLayoutTransition compact={compact}>
                <div data-gn-aside-panel>
                    <button data-gn-composite-bar-item-id="home">Home</button>
                </div>
            </AsideLayoutTransition>
        );
        const {rerender, unmount} = render(view(false));
        try {
            rerender(view(true));
            await act(async () => {
                await Promise.resolve();
            });
            expect(handles.length).toBeGreaterThan(0);
            const first = handles.slice();
            rerender(view(false));
            await act(async () => {
                await Promise.resolve();
            });
            first.forEach(({cancel}) => expect(cancel).toHaveBeenCalledTimes(1));
            const second = handles.slice(first.length);
            expect(second.length).toBeGreaterThan(0);
            // Finishing an interrupted generation must not cancel the newer one.
            await act(async () => {
                first.forEach(({resolve}) => resolve());
            });
            second.forEach(({cancel}) => expect(cancel).not.toHaveBeenCalled());
            unmount();
            second.forEach(({cancel}) => expect(cancel).toHaveBeenCalledTimes(1));
        } finally {
            unmount();
            HTMLElement.prototype.animate = originalAnimate;
            HTMLElement.prototype.getAnimations = originalGetAnimations;
            window.matchMedia = originalMatchMedia;
        }
    });
});

describe('AsideLayoutTransition current presentation ownership', () => {
    type Handle = {
        element: HTMLElement;
        frames: Keyframe[];
        cancel: jest.Mock;
        resolve: () => void;
        reject: () => void;
    };
    let handles: Handle[];
    let emulateNativePaint: boolean;
    const originalAnimate = HTMLElement.prototype.animate;
    const originalGetAnimations = HTMLElement.prototype.getAnimations;
    const originalRect = HTMLElement.prototype.getBoundingClientRect;
    const originalMatchMedia = window.matchMedia;
    const originalStyle = window.getComputedStyle;
    const flush = async () => {
        await act(async () => {
            await Promise.resolve();
            await Promise.resolve();
        });
    };
    // These decorative surfaces and animation effects have no accessible role.
    // eslint-disable-next-line testing-library/no-node-access
    const find = (selector: string) => document.querySelector<HTMLElement>(selector);
    const surface = (id: string) =>
        find(`[data-gn-composite-bar-item-id="${id}"] [data-gn-aside-part="surface"]`);
    const paint = (id: string) =>
        handles.find(
            (handle) => handle.element === surface(id) && 'backgroundColor' in handle.frames[0],
        );

    function Example({transfer = true, hover = true}: {transfer?: boolean; hover?: boolean}) {
        const [compact, setCompact] = React.useState(false);
        const [current, setCurrent] = React.useState(transfer ? 'weekly' : 'analytics');
        const [ambiguous, setAmbiguous] = React.useState(false);
        const [panelVersion, setPanelVersion] = React.useState(0);
        const [hasPanel, setHasPanel] = React.useState(true);
        const row = (id: string, ids: string[], color: string) => (
            <div
                style={{opacity: 1}}
                data-gn-composite-bar-item-id={id}
                data-gn-aside-current-ids={JSON.stringify(ids)}
            >
                <span data-gn-aside-part="surface" style={{backgroundColor: color}} />
            </div>
        );
        const analytics =
            current === 'analytics' || ((compact || ambiguous) && current === 'weekly');
        const hoverColor = compact || !hover ? 'transparent' : 'gray';
        const analyticsIds = ambiguous ? ['weekly', 'reports'] : [current];
        return (
            <>
                <button onClick={() => setCompact((value) => !value)}>Toggle compact</button>
                <button onClick={() => setCurrent('reports')}>Select Reports</button>
                <button onClick={() => setCurrent('home')}>Select Home</button>
                <button
                    onClick={() => {
                        flushSync(() => setCurrent('home'));
                        flushSync(() => setCompact(false));
                    }}
                >
                    Sync select Home and reverse
                </button>
                <button
                    onClick={() => {
                        flushSync(() => setPanelVersion((value) => value + 1));
                        flushSync(() => setCompact(false));
                    }}
                >
                    Sync remount panel and reverse
                </button>
                <button
                    onClick={() => {
                        flushSync(() => setHasPanel(false));
                        flushSync(() => setCompact(false));
                    }}
                >
                    Sync remove panel and reverse
                </button>
                <button
                    onClick={() => {
                        setCompact(false);
                        setAmbiguous(true);
                    }}
                >
                    Reverse ambiguous
                </button>
                <AsideLayoutTransition compact={compact}>
                    {hasPanel && (
                        <div key={panelVersion} data-gn-aside-panel>
                            <div data-gn-aside-current-container>
                                <div id="gravity-ui/navigation-menu-items-composite-bar">
                                    {row(
                                        'home',
                                        current === 'home' ? ['home'] : [],
                                        current === 'home' ? 'blue' : hoverColor,
                                    )}
                                    {row(
                                        'analytics',
                                        analytics ? analyticsIds : [],
                                        analytics ? 'blue' : 'transparent',
                                    )}
                                    {row(
                                        'reports',
                                        current === 'reports' ? ['reports'] : [],
                                        current === 'reports' ? 'blue' : 'transparent',
                                    )}
                                    {!compact &&
                                        !ambiguous &&
                                        transfer &&
                                        row(
                                            'weekly',
                                            current === 'weekly' ? ['weekly'] : [],
                                            'blue',
                                        )}
                                </div>
                            </div>
                        </div>
                    )}
                    <div data-content />
                </AsideLayoutTransition>
            </>
        );
    }

    beforeEach(() => {
        handles = [];
        emulateNativePaint = false;
        HTMLElement.prototype.animate = function (frames) {
            let resolve = () => {};
            let reject = () => {};
            const finished = new Promise<void>((done, fail) => {
                resolve = done;
                reject = fail;
            });
            const cancel = jest.fn();
            handles.push({element: this, frames: frames as Keyframe[], cancel, resolve, reject});
            return {finished, cancel} as unknown as Animation;
        };
        HTMLElement.prototype.getAnimations = () => [];
        HTMLElement.prototype.getBoundingClientRect = () => new DOMRect(10, 20, 100, 40);
        window.matchMedia = jest.fn().mockReturnValue({matches: false});
        jest.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
            const style = originalStyle(element);
            if (element.hasAttribute('data-gn-aside-current-suppressed')) {
                Object.defineProperty(style, 'backgroundColor', {value: 'rgba(0, 0, 0, 0)'});
            } else if (emulateNativePaint) {
                const activePaint = handles.find(
                    (handle) =>
                        handle.element === element &&
                        !handle.cancel.mock.calls.length &&
                        'backgroundColor' in handle.frames[0],
                );
                if (activePaint)
                    Object.defineProperty(style, 'backgroundColor', {
                        value: activePaint.frames[0].backgroundColor,
                    });
            }
            return style;
        });
    });
    afterEach(() => {
        HTMLElement.prototype.animate = originalAnimate;
        HTMLElement.prototype.getAnimations = originalGetAnimations;
        HTMLElement.prototype.getBoundingClientRect = originalRect;
        window.matchMedia = originalMatchMedia;
        jest.restoreAllMocks();
    });

    it('observes child current changes when only native paint exists', async () => {
        render(<Example transfer={false} />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        const homePaint = paint('home');
        expect(homePaint).toBeDefined();
        expect(find('[data-gn-aside-current-indicator]')).toBeNull();
        fireEvent.click(screen.getByRole('button', {name: 'Select Home'}));
        await flush();
        expect(homePaint?.cancel).toHaveBeenCalledTimes(1);
    });

    it('keeps unrelated hover paint observed after the last transfer is invalidated', async () => {
        render(<Example />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        const homePaint = paint('home');
        expect(homePaint).toBeDefined();
        expect(find('[data-gn-aside-current-indicator]')).not.toBeNull();
        fireEvent.click(screen.getByRole('button', {name: 'Select Reports'}));
        await flush();
        expect(find('[data-gn-aside-current-indicator]')).toBeNull();
        expect(homePaint?.cancel).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole('button', {name: 'Select Home'}));
        await flush();
        expect(homePaint?.cancel).toHaveBeenCalledTimes(1);
    });

    it('preserves native geometry while the indicator owns color', async () => {
        render(<Example />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        expect(find('[data-gn-aside-current-indicator]')).not.toBeNull();
        expect(
            handles.some(
                ({element, frames}) => element === surface('analytics') && 'width' in frames[0],
            ),
        ).toBe(true);
        expect(paint('analytics')).toBeUndefined();
    });

    it('restores native paint before a React batched reversal rejects an ambiguous transfer', async () => {
        render(<Example />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        const moving = find('[data-gn-aside-current-indicator]');
        expect(moving).not.toBeNull();
        if (!moving) throw new Error('Expected moving transfer');
        moving.getBoundingClientRect = () => new DOMRect(15, 25, 90, 35);
        expect(surface('analytics')?.hasAttribute('data-gn-aside-current-suppressed')).toBe(true);
        handles = [];
        fireEvent.click(screen.getByRole('button', {name: 'Reverse ambiguous'}));
        await flush();
        expect(find('[data-gn-aside-current-indicator]')).toBeNull();
        expect(paint('analytics')).toBeUndefined();
    });

    it.each(['resolve', 'reject'] as const)(
        'disconnects after paint %s while layout stays active',
        async (settle) => {
            const disconnect = jest.spyOn(MutationObserver.prototype, 'disconnect');
            const observe = jest.spyOn(MutationObserver.prototype, 'observe');
            render(<Example transfer={false} />);
            fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
            await flush();
            expect(observe).toHaveBeenCalled();
            const homePaint = paint('home');
            expect(homePaint).toBeDefined();
            homePaint?.[settle]();
            await flush();
            expect(homePaint?.cancel).toHaveBeenCalledTimes(1);
            expect(disconnect).toHaveBeenCalledTimes(1);
            expect(find('[data-gn-aside-animating]')).not.toBeNull();
        },
    );

    it('ignores stale paint settlement after reversal and cannot recreate observation on unmount', async () => {
        const disconnect = jest.spyOn(MutationObserver.prototype, 'disconnect');
        const observe = jest.spyOn(MutationObserver.prototype, 'observe');
        const {unmount} = render(<Example />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        const oldPaint = paint('home');
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        const disconnected = disconnect.mock.calls.length;
        oldPaint?.resolve();
        await flush();
        expect(disconnect).toHaveBeenCalledTimes(disconnected);
        const subscriptions = observe.mock.calls.length;
        unmount();
        await flush();
        expect(disconnect).toHaveBeenCalledTimes(disconnected + 1);
        expect(observe).toHaveBeenCalledTimes(subscriptions);
    });

    it.each(['remove', 'replace'] as const)(
        'cancels paint when its panel is %s even without transfers',
        async (operation) => {
            const disconnect = jest.spyOn(MutationObserver.prototype, 'disconnect');
            const observe = jest.spyOn(MutationObserver.prototype, 'observe');
            const {unmount} = render(<Example transfer={false} />);
            fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
            await flush();
            const homePaint = paint('home');
            const panel = find('[data-gn-aside-panel]');
            if (!panel) throw new Error('Expected panel');
            // Simulate a host replacing/removing the panel beneath the transition boundary.
            // eslint-disable-next-line testing-library/no-node-access
            const parent = panel.parentElement;
            // eslint-disable-next-line testing-library/no-node-access
            const next = panel.nextSibling;
            const subscriptions = observe.mock.calls.length;
            if (operation === 'remove') panel.remove();
            else panel.replaceWith(panel.cloneNode(true));
            await flush();
            expect(homePaint?.cancel).toHaveBeenCalledTimes(1);
            expect(disconnect).toHaveBeenCalledTimes(1);
            expect(observe).toHaveBeenCalledTimes(subscriptions);
            expect(panel.hasAttribute('data-gn-aside-animating')).toBe(false);
            if (operation === 'replace') find('[data-gn-aside-panel]')?.remove();
            parent?.insertBefore(panel, next);
            unmount();
        },
    );

    it('cancels only detached native paint when a noncurrent surface is replaced', async () => {
        render(<Example />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        const home = surface('home');
        const homePaint = paint('home');
        const homeGeometry = handles.find(
            ({element, frames}) => element === home && 'width' in frames[0],
        );
        if (!home) throw new Error('Expected Home surface');
        home.replaceWith(home.cloneNode(true));
        await flush();
        expect(homePaint?.cancel).toHaveBeenCalledTimes(1);
        expect(homeGeometry?.cancel).not.toHaveBeenCalled();
        expect(find('[data-gn-aside-current-indicator]')).not.toBeNull();
        expect(find('[data-gn-aside-animating]')).not.toBeNull();
    });

    it('removes cancelled paint from resource ownership before common cleanup', async () => {
        const {unmount} = render(<Example transfer={false} />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        const homePaint = paint('home');
        fireEvent.click(screen.getByRole('button', {name: 'Select Home'}));
        await flush();
        expect(homePaint?.cancel).toHaveBeenCalledTimes(1);
        unmount();
        expect(homePaint?.cancel).toHaveBeenCalledTimes(1);
    });

    it('does not observe an empty union', async () => {
        const observe = jest.spyOn(MutationObserver.prototype, 'observe');
        render(<Example transfer={false} hover={false} />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        expect(paint('home')).toBeUndefined();
        expect(find('[data-gn-aside-current-indicator]')).toBeNull();
        expect(observe).not.toHaveBeenCalled();
    });

    it('reconciles current committed before observer delivery before a paint-only reversal snapshot', async () => {
        render(<Example transfer={false} />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        const previousCount = handles.length;
        expect(paint('home')).toBeDefined();
        emulateNativePaint = true;
        fireEvent.click(screen.getByRole('button', {name: 'Sync select Home and reverse'}));
        await flush();
        const obsoletePaint = handles
            .slice(previousCount)
            .find(
                ({element, frames}) =>
                    element === surface('home') && 'backgroundColor' in frames[0],
            );
        expect(obsoletePaint).toBeUndefined();
    });

    it('measures the current target after the animating flag prepares its layout', async () => {
        HTMLElement.prototype.getBoundingClientRect = function () {
            const target = this.matches(
                '[data-gn-composite-bar-item-id="analytics"] [data-gn-aside-part="surface"]',
            );
            // eslint-disable-next-line testing-library/no-node-access
            const prepared = Boolean(this.closest('[data-gn-aside-animating]'));
            return new DOMRect(10, 20, target && prepared ? 38 : 100, 40);
        };
        render(<Example />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        const indicator = find('[data-gn-aside-current-indicator]');
        expect(indicator).not.toBeNull();
        expect(handles.find(({element}) => element === indicator)?.frames[1].width).toBe('38px');
    });

    it('keeps observing until the last transfer settles after native paint', async () => {
        const disconnect = jest.spyOn(MutationObserver.prototype, 'disconnect');
        render(<Example />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        paint('home')?.resolve();
        await flush();
        expect(disconnect).not.toHaveBeenCalled();
        const indicator = find('[data-gn-aside-current-indicator]');
        expect(indicator).not.toBeNull();
        handles.find(({element}) => element === indicator)?.resolve();
        await flush();
        expect(disconnect).toHaveBeenCalledTimes(1);
        expect(find('[data-gn-aside-animating]')).not.toBeNull();
    });

    it('does not merge a detached ghost into a synchronously remounted panel reversal snapshot', async () => {
        const snapshots = jest.spyOn(AsideLayoutTransition.prototype, 'getSnapshotBeforeUpdate');
        render(<Example />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        const oldPanel = find('[data-gn-aside-panel]');
        const oldGhost = find('[data-gn-aside-transition-overlay] [data-gn-aside-current-row-key]');
        expect(oldGhost).not.toBeNull();
        const oldHandles = [...handles];
        snapshots.mockClear();
        fireEvent.click(screen.getByRole('button', {name: 'Sync remount panel and reverse'}));
        const replacementSnapshot = snapshots.mock.results[snapshots.mock.results.length - 1]
            ?.value as ReturnType<AsideLayoutTransition['getSnapshotBeforeUpdate']>;
        expect(oldPanel?.isConnected).toBe(false);
        expect(oldGhost?.isConnected).toBe(false);
        expect(replacementSnapshot).not.toBeNull();
        if (!replacementSnapshot) throw new Error('Expected replacement-panel snapshot');
        expect([...replacementSnapshot.rows.values()].some((row) => row.element === oldGhost)).toBe(
            false,
        );
        expect(oldPanel?.hasAttribute('data-gn-aside-animating')).toBe(false);
        expect(oldHandles.every(({cancel}) => cancel.mock.calls.length > 0)).toBe(true);
        await flush();
    });

    it('cleans the old transition synchronously when the panel is absent before reversal', async () => {
        const disconnect = jest.spyOn(MutationObserver.prototype, 'disconnect');
        render(<Example />);
        fireEvent.click(screen.getByRole('button', {name: 'Toggle compact'}));
        await flush();
        const oldPanel = find('[data-gn-aside-panel]');
        const oldHandles = [...handles];
        fireEvent.click(screen.getByRole('button', {name: 'Sync remove panel and reverse'}));
        expect(find('[data-gn-aside-panel]')).toBeNull();
        expect(oldPanel?.hasAttribute('data-gn-aside-animating')).toBe(false);
        expect(disconnect).toHaveBeenCalledTimes(1);
        expect(oldHandles.every(({cancel}) => cancel.mock.calls.length > 0)).toBe(true);
        await flush();
    });
});
