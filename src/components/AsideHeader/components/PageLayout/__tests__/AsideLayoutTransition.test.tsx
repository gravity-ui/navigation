/** @jest-environment jsdom */
import React from 'react';

import {act, render} from '@testing-library/react';

import {AsideLayoutTransition} from '../AsideLayoutTransition';

describe('AsideLayoutTransition lifecycle', () => {
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
