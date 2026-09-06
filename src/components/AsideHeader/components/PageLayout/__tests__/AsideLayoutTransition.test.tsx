/** @jest-environment jsdom */
import React from 'react';

import {act, fireEvent, render, screen} from '@testing-library/react';

import {AsideLayoutTransition} from '../AsideLayoutTransition';

describe('AsideLayoutTransition lifecycle', () => {
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
