/** @jest-environment jsdom */
// Structural registration, adjacency and ref ownership are the public behavior under test.
/* eslint-disable testing-library/no-node-access, testing-library/no-container */
import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';

import {AsideHeader} from '../../../AsideHeader';
import {PageLayout} from '../../PageLayout/PageLayout';
import {PageLayoutAside} from '../../PageLayout/PageLayoutAside';
import {FooterItem} from '../FooterItem';

jest.mock('../../../i18n');
jest.mock('../../CompositeBar/Item/ItemPopup', () => ({
    ItemPopup: ({children, disabled}: {children: React.ReactNode; disabled: boolean}) => (
        <span data-testid="label-popup" data-disabled={String(disabled)}>
            {children}
        </span>
    ),
}));
jest.mock('../../../../../../assets/icons/control-menu-button.svg', () => ({
    __esModule: true,
    default: () => null,
}));
jest.mock('../../../../../../assets/icons/divider-collapsed.svg', () => ({
    __esModule: true,
    default: () => null,
}));
jest.mock('../../AllPagesPanel', () => ({
    useVisibleMenuItems: () => [],
    getAllPagesMenuItem: () => ({id: 'all-pages', title: 'All pages'}),
}));
const footer = (ids: string[], hidden?: string) =>
    function TestFooter() {
        return (
            <>
                {ids.map((id) => (
                    <div key={id} hidden={id === hidden}>
                        <FooterItem id={id} title={id} />
                    </div>
                ))}
                <FooterItem id="divider" title="divider" type="divider" />
            </>
        );
    };
const view = (props: Partial<React.ComponentProps<typeof AsideHeader>>) => (
    <ThemeProvider>
        <AsideHeader compact={false} {...props} />
    </ThemeProvider>
);

describe('floating collapse anchor', () => {
    it.each([undefined, () => <div>custom footer</div>])(
        'uses its fallback row as the only hover anchor',
        (renderFooter) => {
            const {container, rerender} = render(view({compact: true, renderFooter}));
            const fallback = container.querySelector('[data-gn-collapse-fallback]');
            expect(fallback).not.toBeNull();
            expect(container.querySelector('[data-gn-collapse-anchor]')).toBe(fallback);
            rerender(view({compact: true, renderFooter: footer(['row'])}));
            expect(container.querySelector('[data-gn-collapse-fallback]')).toBeNull();
            expect(container.querySelectorAll('[data-gn-collapse-anchor]')).toHaveLength(1);
            expect(container.querySelector('[data-gn-collapse-anchor]')).toBe(
                screen.getByRole('button', {name: 'row'}),
            );
        },
    );
    it('selects last visible registered row and follows reorder, hiding and cleanup', async () => {
        const {container, rerender} = render(view({renderFooter: footer(['a', 'b'])}));
        const selected = () => container.querySelector('[data-gn-collapse-anchor]');
        await waitFor(() => expect(selected()).toBe(screen.getByRole('button', {name: 'b'})));
        rerender(view({renderFooter: footer(['b', 'a'])}));
        await waitFor(() => expect(selected()).toBe(screen.getByRole('button', {name: 'a'})));
        rerender(view({renderFooter: footer(['b', 'a'], 'a')}));
        await waitFor(() => expect(selected()).toBe(screen.getByRole('button', {name: 'b'})));
        rerender(view({renderFooter: () => <div>custom footer</div>}));
        await waitFor(() =>
            expect(selected()).toBe(container.querySelector('[data-gn-collapse-fallback]')),
        );
        expect(container.querySelector('[data-gn-collapse-fallback]')).not.toBeNull();
        rerender(view({hideCollapseButton: true, renderFooter: footer(['a'])}));
        expect(container.querySelector('[data-gn-aside-collapse-layer]')).toBeNull();
        expect(container.querySelector('[data-gn-collapse-fallback]')).toBeNull();
        expect(selected()).toBeNull();
    });
    it('links a stable native button to its panel, retains focus and places the layer adjacent', () => {
        const onChangeCompact = jest.fn();
        const {container, rerender} = render(view({compact: true, onChangeCompact}));
        const panel = container.querySelector('[data-gn-aside-panel]') as HTMLElement;
        const layer = panel.nextElementSibling as HTMLElement;
        expect(layer.hasAttribute('data-gn-aside-collapse-layer')).toBe(true);
        const button = layer.querySelector('button') as HTMLButtonElement;
        expect(button.getAttribute('aria-controls')).toBe(panel.id);
        expect(panel.id).not.toBe('');
        expect(button.getAttribute('type')).toBe('button');
        expect(button.getAttribute('aria-expanded')).toBe('false');
        button.focus();
        fireEvent.click(button);
        expect(onChangeCompact).toHaveBeenLastCalledWith(false);
        rerender(view({compact: false, onChangeCompact}));
        expect(layer.querySelector('button')).toBe(button);
        expect(document.activeElement).toBe(button);
        expect(button.getAttribute('aria-expanded')).toBe('true');
        fireEvent.click(button);
        expect(onChangeCompact).toHaveBeenLastCalledWith(true);
    });
    it('suppresses only the compact anchor label even with explicit enableTooltip', async () => {
        const renderFooter = ({compact}: {compact: boolean}) => (
            <>
                <FooterItem id="a" title="a" icon={Gear} compact={compact} enableTooltip />
                <FooterItem id="b" title="b" icon={Gear} compact={compact} enableTooltip />
            </>
        );
        const {rerender} = render(view({compact: true, renderFooter}));
        await waitFor(() =>
            expect(
                screen
                    .getAllByTestId('label-popup')
                    .map((popup) => popup.getAttribute('data-disabled')),
            ).toEqual(['false', 'true']),
        );
        rerender(view({compact: true, renderFooter, hideCollapseButton: true}));
        await waitFor(() =>
            expect(
                screen
                    .getAllByTestId('label-popup')
                    .map((popup) => popup.getAttribute('data-disabled')),
            ).toEqual(['false', 'false']),
        );
    });
    it('reselects an anchor when CSS visibility changes through a resize notification', () => {
        const original = global.ResizeObserver;
        const observers: {callback: ResizeObserverCallback; observe: jest.Mock}[] = [];
        global.ResizeObserver = jest.fn().mockImplementation((callback: ResizeObserverCallback) => {
            const observer = {
                callback,
                observe: jest.fn(),
                unobserve: jest.fn(),
                disconnect: jest.fn(),
            };
            observers.push(observer);
            return observer;
        });
        const {container, unmount} = render(view({renderFooter: footer(['a', 'b'])}));
        const panel = container.querySelector('[data-gn-aside-panel]');
        const row = screen.getByRole('button', {name: 'b'});
        const observer = observers.find((item) =>
            item.observe.mock.calls.some(([target]) => target === panel),
        );
        expect(row.hasAttribute('data-gn-collapse-anchor')).toBe(true);
        const getStyle = window.getComputedStyle;
        const styleSpy = jest
            .spyOn(window, 'getComputedStyle')
            .mockImplementation((element, pseudo) => {
                const style = getStyle(element, pseudo);
                if (element === row)
                    return new Proxy(style, {
                        get: (target, name) =>
                            name === 'display' ? 'none' : Reflect.get(target, name),
                    });
                return style;
            });
        try {
            act(() => {
                observer?.callback([], {} as ResizeObserver);
            });
            expect(
                screen.getByRole('button', {name: 'a'}).hasAttribute('data-gn-collapse-anchor'),
            ).toBe(true);
            expect(row.hasAttribute('data-gn-collapse-anchor')).toBe(false);
        } finally {
            styleSpy.mockRestore();
            unmount();
            global.ResizeObserver = original;
        }
    });
    it.each(['transitionend', 'transitioncancel'])(
        'skips width-only frames and reconciles heights, idle resizes and %s',
        (eventType) => {
            const original = global.ResizeObserver;
            const observers: {callback: ResizeObserverCallback; observe: jest.Mock}[] = [];
            global.ResizeObserver = jest
                .fn()
                .mockImplementation((callback: ResizeObserverCallback) => {
                    const observer = {
                        callback,
                        observe: jest.fn(),
                        unobserve: jest.fn(),
                        disconnect: jest.fn(),
                    };
                    observers.push(observer);
                    return observer;
                });
            const {container, unmount} = render(view({renderFooter: footer(['a', 'b'])}));
            const panel = container.querySelector('[data-gn-aside-panel]') as HTMLElement;
            const observer = observers.find((item) =>
                item.observe.mock.calls.some(([target]) => target === panel),
            );
            if (!observer) throw new Error('Collapse observer missing');
            const resize = (width: number, height = 500) =>
                act(() =>
                    observer.callback(
                        [
                            {
                                target: panel,
                                contentRect: {width, height},
                            } as unknown as ResizeObserverEntry,
                        ],
                        {} as ResizeObserver,
                    ),
                );
            resize(56);
            panel.setAttribute('data-gn-aside-animating', '');
            const getStyle = window.getComputedStyle;
            const styleSpy = jest.spyOn(window, 'getComputedStyle');
            try {
                resize(80);
                resize(120);
                resize(200);
                expect(styleSpy).not.toHaveBeenCalled();
                resize(200, 480);
                expect(styleSpy).toHaveBeenCalled();
                styleSpy.mockClear();
                panel.removeAttribute('data-gn-aside-animating');
                resize(220, 480);
                expect(styleSpy).toHaveBeenCalled();
                const row = screen.getByRole('button', {name: 'b'});
                // A CSS visibility change does not change the observed box height.
                styleSpy.mockImplementation((element, pseudo) => {
                    const style = getStyle(element, pseudo);
                    return element === row
                        ? new Proxy(style, {
                              get: (target, name) =>
                                  name === 'visibility' ? 'hidden' : Reflect.get(target, name),
                          })
                        : style;
                });
                panel.setAttribute('data-gn-aside-animating', '');
                resize(236, 480);
                expect(row.hasAttribute('data-gn-collapse-anchor')).toBe(true);
                const finish = (target: HTMLElement, property: string) => {
                    const event = new Event(eventType, {bubbles: true});
                    Object.defineProperty(event, 'propertyName', {value: property});
                    fireEvent(target, event);
                };
                finish(panel, 'opacity');
                finish(row, 'width');
                expect(row.hasAttribute('data-gn-collapse-anchor')).toBe(true);
                finish(panel, 'width');
                expect(row.hasAttribute('data-gn-collapse-anchor')).toBe(false);
                expect(
                    screen.getByRole('button', {name: 'a'}).hasAttribute('data-gn-collapse-anchor'),
                ).toBe(true);
            } finally {
                styleSpy.mockRestore();
                unmount();
                global.ResizeObserver = original;
            }
        },
    );
    it('does not use a partial offset when the anchor leaves the panel offset chain', () => {
        const original = global.ResizeObserver;
        const observers: {callback: ResizeObserverCallback; observe: jest.Mock}[] = [];
        global.ResizeObserver = jest.fn().mockImplementation((callback: ResizeObserverCallback) => {
            const observer = {
                callback,
                observe: jest.fn(),
                unobserve: jest.fn(),
                disconnect: jest.fn(),
            };
            observers.push(observer);
            return observer;
        });
        const {container, unmount} = render(view({renderFooter: footer(['row'])}));
        const panel = container.querySelector('[data-gn-aside-panel]') as HTMLElement;
        const slot = container.querySelector('[data-gn-aside-collapse-slot]') as HTMLElement;
        const row = screen.getByRole('button', {name: 'row'});
        const observer = observers.find((item) =>
            item.observe.mock.calls.some(([target]) => target === panel),
        );
        if (!observer) throw new Error('Collapse observer missing');
        Object.defineProperties(row, {
            offsetParent: {value: panel, configurable: true},
            offsetTop: {value: 500},
        });
        try {
            act(() => observer.callback([], {} as ResizeObserver));
            expect(slot.style.top).toBe('500px');
            Object.defineProperty(row, 'offsetParent', {value: null});
            act(() => observer.callback([], {} as ResizeObserver));
            expect(slot.style.top).toBe('');
            expect(slot.style.bottom).toBe('');
        } finally {
            unmount();
            global.ResizeObserver = original;
        }
    });
    it('disconnects observation and removes anchor registration when hidden or unmounted', () => {
        const original = global.ResizeObserver;
        const observers: {observe: jest.Mock; unobserve: jest.Mock; disconnect: jest.Mock}[] = [];
        global.ResizeObserver = jest.fn().mockImplementation(() => {
            const observer = {observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn()};
            observers.push(observer);
            return observer;
        });
        const {container, rerender, unmount} = render(view({renderFooter: footer(['row'])}));
        const panel = container.querySelector('[data-gn-aside-panel]');
        const row = screen.getByRole('button', {name: 'row'});
        const observer = observers.find((item) =>
            item.observe.mock.calls.some(([target]) => target === panel),
        );
        expect(observer?.observe.mock.calls.some(([target]) => target === row)).toBe(true);
        rerender(view({hideCollapseButton: true, renderFooter: footer(['row'])}));
        expect(observer?.disconnect).toHaveBeenCalledTimes(1);
        expect(row.hasAttribute('data-gn-collapse-anchor')).toBe(false);
        unmount();
        global.ResizeObserver = original;
    });
    it('isolates instances and supports display contents and wrappers', async () => {
        const {container} = render(
            <ThemeProvider>
                <PageLayout compact={false}>
                    <div style={{display: 'contents'}}>
                        <PageLayoutAside
                            renderFooter={footer(['first'])}
                            collapseButtonWrapper={(button) => (
                                <span data-testid="wrapper">{button}</span>
                            )}
                        />
                    </div>
                    <PageLayout.Content />
                </PageLayout>
                <AsideHeader compact={false} renderFooter={footer(['second'])} />
            </ThemeProvider>,
        );
        await waitFor(() =>
            expect(container.querySelectorAll('[data-gn-collapse-anchor]')).toHaveLength(2),
        );
        const panels = container.querySelectorAll('[data-gn-aside-panel]');
        expect(panels[0].id).not.toBe(panels[1].id);
        expect(panels[0].nextElementSibling?.hasAttribute('data-gn-aside-collapse-layer')).toBe(
            true,
        );
        expect(
            screen.getByTestId('wrapper').querySelector('button')?.getAttribute('aria-controls'),
        ).toBe(panels[0].id);
    });
});
