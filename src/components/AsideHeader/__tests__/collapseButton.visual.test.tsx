/* Playwright queries are page-scoped, not Testing Library render queries. */
/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';

import {expect} from '@playwright/experimental-ct-react';
import type {Page} from '@playwright/test';

import {test} from '~playwright/core';

import {CollapseButtonExample} from '../__playwright__/CollapseButtonExample';
import {
    finishAnimations,
    seekAnimations,
    toggleAsideAndPause,
} from '../__playwright__/transitionTestUtils';

const panelSelector = '[data-gn-aside-panel]';
const slotSelector = '[data-gn-aside-collapse-slot]';
const buttonSelector = 'button[class*="gn-collapse-button_"]';
const anchorSelector = '[data-gn-collapse-anchor]';
const viewport = {width: 1000, height: 720};

async function geometry(page: Page) {
    return page.evaluate(
        (selectors) => {
            const get = (selector: string) => {
                const element = document.querySelector<HTMLElement>(selector);
                if (!element) throw new Error(`Missing ${selector}`);
                const {x, y, width, height, right, bottom} = element.getBoundingClientRect();
                return {x, y, width, height, right, bottom};
            };
            const slot = document.querySelector<HTMLElement>(selectors.slotSelector);
            if (!slot) throw new Error('Missing collapse slot');
            return {
                panel: get(selectors.panelSelector),
                slot: get(selectors.slotSelector),
                button: get(selectors.buttonSelector),
                anchor: document.querySelector(selectors.anchorSelector)
                    ? get(selectors.anchorSelector)
                    : null,
                radius: parseFloat(getComputedStyle(slot).borderTopLeftRadius),
            };
        },
        {panelSelector, slotSelector, buttonSelector, anchorSelector},
    );
}

async function captureFooter(page: Page, name: string, direction: 'ltr' | 'rtl', drawer = false) {
    const {panel, button} = await geometry(page);
    // Include the whole last row, aside edge, and the protruding tab/Drawer region.
    const width = Math.min(drawer ? 420 : panel.width + 48, viewport.width);
    const x = direction === 'ltr' ? panel.x : panel.right - width;
    const y = Math.max(0, button.y - 50);
    for (const colorScheme of ['light', 'dark'] as const) {
        await page.emulateMedia({colorScheme});
        await expect(page.locator('.g-root')).toHaveClass(
            new RegExp(`g-root_theme_${colorScheme}`),
        );
        await page.evaluate(() => document.fonts.ready);
        expect(
            await page.screenshot({
                clip: {x, y, width, height: Math.min(150, viewport.height - y)},
                animations: 'disabled',
            }),
        ).toMatchSnapshot(`${name}-${colorScheme}.png`);
    }
}

for (const menuDensity of ['default', 'compact'] as const) {
    for (const footer of ['empty', 'custom'] as const) {
        for (const direction of ['ltr', 'rtl'] as const) {
            test(`fallback hover and focus (${footer}, ${menuDensity}, ${direction})`, async ({
                mount,
                page,
            }) => {
                await page.setViewportSize(viewport);
                await mount(
                    <CollapseButtonExample {...{footer, menuDensity, direction}} />,
                    undefined,
                    viewport,
                );
                const fallback = page.locator('[data-gn-collapse-fallback]');
                const button = page.locator(buttonSelector);
                await expect(fallback).toHaveAttribute('data-gn-collapse-anchor', '');
                await expect(button).toHaveCSS('opacity', '0');
                await fallback.hover();
                await expect(button).toHaveCSS('opacity', '1');
                await expect(button).toHaveCSS('transform', 'none');
                await page.mouse.move(500, 300);
                await expect(button).toHaveCSS('opacity', '0');
                await page.getByRole('button', {name: 'All pages', exact: true}).focus();
                await page.keyboard.press('Tab');
                await expect(button).toBeFocused();
                await expect(button).toHaveCSS('opacity', '1');
                await button.click();
                await expect(button).toHaveAttribute('aria-expanded', 'true');
                await expect(page.getByRole('status', {name: 'Compact changes'})).toHaveText('1');
                await page.getByRole('button', {name: 'Hide toggle'}).click();
                await expect(fallback).toHaveCount(0);
                await expect(button).toHaveCount(0);
            });
        }
    }
    for (const direction of ['ltr', 'rtl'] as const) {
        for (const state of [
            'compact-hidden',
            'compact-hover',
            'compact-focus',
            'expanded',
            'expanded-hover',
        ] as const) {
            test(`collapse button ${state} ${menuDensity} ${direction}`, async ({mount, page}) => {
                await page.setViewportSize(viewport);
                const compact = state.startsWith('compact');
                await mount(
                    <CollapseButtonExample
                        {...{menuDensity, direction}}
                        initialCompact={compact}
                    />,
                    undefined,
                    viewport,
                );
                await finishAnimations(page);
                const button = page.locator(buttonSelector);
                if (state === 'compact-hover') await page.locator(anchorSelector).hover();
                if (state === 'expanded-hover') await button.hover();
                if (state === 'compact-focus') {
                    await page.locator(anchorSelector).focus();
                    await page.keyboard.press('Tab');
                    await expect(button).toBeFocused();
                }
                await expect(button).toHaveCSS('opacity', state === 'compact-hidden' ? '0' : '1');
                const rect = await geometry(page);
                if (!rect.anchor) throw new Error('Missing footer anchor');
                expect(rect.slot.width).toBe(compact ? 20 : 24);
                expect(rect.button.height).toBe(menuDensity === 'default' ? 40 : 32);
                expect(rect.radius).toBe(compact ? 12 : 8);
                expect(rect.button.y).toBeCloseTo(
                    rect.anchor.y + (rect.anchor.height - rect.button.height) / 2,
                    1,
                );
                if (compact) {
                    expect(
                        direction === 'ltr'
                            ? rect.slot.right - rect.panel.right
                            : rect.panel.x - rect.slot.x,
                    ).toBeCloseTo(10, 1);
                } else {
                    expect(
                        direction === 'ltr'
                            ? rect.anchor.right <= rect.slot.x
                            : rect.anchor.x >= rect.slot.right,
                    ).toBe(true);
                }
                await captureFooter(page, `${state}-${menuDensity}-${direction}`, direction);
            });
        }
    }

    for (const kind of ['all-pages', 'custom'] as const) {
        test(`collapse button above ${kind} panel ${menuDensity}`, async ({mount, page}) => {
            await page.setViewportSize(viewport);
            await mount(<CollapseButtonExample menuDensity={menuDensity} />, undefined, viewport);
            if (kind === 'custom')
                await page.getByRole('button', {name: 'Toggle custom panel', exact: true}).click();
            else await page.getByRole('button', {name: 'All pages', exact: true}).click();
            await finishAnimations(page);
            await page.locator(buttonSelector).hover();
            await expect(page.locator(buttonSelector)).toHaveCSS('opacity', '1');
            const overlay = page.locator('.g-drawer[data-floating-ui-status="open"]');
            await expect(overlay).toBeVisible();
            const before = await geometry(page);
            await captureFooter(page, `panel-${kind}-${menuDensity}`, 'ltr', true);
            const hit = await page.locator(buttonSelector).evaluate((button) => {
                const rect = button.getBoundingClientRect();
                return button.contains(
                    document.elementFromPoint(rect.right - 3, rect.y + rect.height / 2),
                );
            });
            expect(hit).toBe(true);
            await page.locator(buttonSelector).click();
            await expect(page.getByRole('status', {name: 'Compact changes'})).toHaveText('1');
            await expect(page.getByRole('status', {name: 'Footer actions'})).toHaveText('0');
            await expect(overlay).toBeVisible();
            await finishAnimations(page);
            const after = await geometry(page);
            expect(after.panel.width).toBeGreaterThan(before.panel.width);
            await expect(overlay).toHaveCSS('left', `${after.panel.width}px`);
            if (kind === 'custom')
                await expect(page.getByText('Custom panel content')).toBeVisible();
            await captureFooter(page, `panel-${kind}-expanded-${menuDensity}`, 'ltr', true);
        });
    }

    for (const footer of ['action', 'two-line', 'empty', 'custom'] as const) {
        test(`collapse button measures ${footer} footer ${menuDensity}`, async ({mount, page}) => {
            const withFooterItems = footer === 'action' || footer === 'two-line';
            await page.setViewportSize(viewport);
            await mount(
                <CollapseButtonExample
                    {...{menuDensity, footer}}
                    initialCompact={false}
                    below
                    topAlert
                    contentsWrapper
                />,
                undefined,
                viewport,
            );
            await finishAnimations(page);
            // TopAlert measures its height after mount; wait for the shared sticky geometry
            // and ResizeObserver delivery before comparing row and button positions.
            await expect
                .poll(() =>
                    page
                        .locator(panelSelector)
                        .evaluate((panel) => parseFloat(getComputedStyle(panel).top)),
                )
                .toBeGreaterThan(0);
            await expect
                .poll(async () => {
                    const current = await geometry(page);
                    const anchor =
                        current.anchor ??
                        (await page.locator('[data-gn-collapse-fallback]').boundingBox());
                    if (!anchor) throw new Error('Missing footer target');
                    return (
                        current.button.y + current.button.height / 2 - anchor.y - anchor.height / 2
                    );
                })
                .toBeCloseTo(0, 1);
            const initial = await geometry(page);
            expect(initial.panel.width).toBe(menuDensity === 'default' ? 236 : 220);
            expect(initial.button.right).toBeLessThan(initial.panel.right);
            if (initial.anchor && withFooterItems) {
                expect(initial.anchor.right).toBeLessThanOrEqual(initial.slot.x);
                expect(initial.button.y + initial.button.height / 2).toBeCloseTo(
                    initial.anchor.y + initial.anchor.height / 2,
                    1,
                );
                const below = await page.getByTestId('below-footer').boundingBox();
                if (!below) throw new Error('Missing trailing footer content');
                expect(initial.button.bottom).toBeLessThanOrEqual(below.y);
            }
            if (footer === 'action') {
                await expect(page.locator(anchorSelector)).toHaveCSS('margin-inline-start', '10px');
                await expect(page.locator(anchorSelector)).toHaveCSS('margin-inline-end', '34px');
            }
            if (initial.anchor && withFooterItems) {
                const adornment = await page
                    .locator(anchorSelector)
                    .getByTestId('adornment')
                    .boundingBox();
                if (!adornment) throw new Error('Missing row adornment');
                expect(adornment.x + adornment.width).toBeLessThanOrEqual(initial.slot.x);
            }
            await page.evaluate(() => window.scrollTo(0, 150));
            await expect
                .poll(async () => (await geometry(page)).button.y - (await geometry(page)).panel.y)
                .toBeCloseTo(initial.button.y - initial.panel.y, 1);
            await page.locator(buttonSelector).click();
            await expect(page.getByRole('status', {name: 'Compact changes'})).toHaveText('1');
            await finishAnimations(page);
            expect((await geometry(page)).slot.width).toBe(20);
        });
    }
}

for (const footer of ['regular', 'empty'] as const) {
    test(`footer density height is independent from menu height (${footer})`, async ({
        mount,
        page,
    }) => {
        await page.setViewportSize(viewport);
        await mount(
            <CollapseButtonExample footer={footer} initialCompact={false} />,
            undefined,
            viewport,
        );
        await page.locator('[data-gn-aside-collapse-layer]').evaluate((layer) => {
            layer.parentElement?.style.setProperty(
                '--_--gn-aside-header-density-footer-item-height',
                '48px',
            );
        });
        await expect(page.locator(slotSelector)).toHaveCSS('height', '48px');
        await expect(page.locator(anchorSelector)).toHaveCSS('height', '48px');
        await expect(page.getByRole('button', {name: 'Home', exact: true})).toHaveCSS(
            'height',
            '40px',
        );
    });
}

test('collapse button follows reordered and hidden rows without resizing footer', async ({
    mount,
    page,
}) => {
    await page.setViewportSize(viewport);
    await mount(<CollapseButtonExample initialCompact={false} below />, undefined, viewport);
    await finishAnimations(page);
    const initial = await geometry(page);
    await expect(page.locator(anchorSelector)).toHaveAttribute(
        'data-gn-composite-bar-item-id',
        'account',
    );
    await page.getByRole('button', {name: 'Reverse footer'}).click();
    await expect(page.locator(anchorSelector)).toHaveAttribute(
        'data-gn-composite-bar-item-id',
        'settings',
    );
    expect((await geometry(page)).button.y).toBe(initial.button.y);
    await page.getByRole('button', {name: 'Reverse footer'}).click();
    await page.getByRole('button', {name: 'Hide account'}).click();
    await expect(page.locator(anchorSelector)).toHaveAttribute(
        'data-gn-composite-bar-item-id',
        'settings',
    );
    const selected = await geometry(page);
    if (!selected.anchor) throw new Error('Missing replacement anchor');
    expect(selected.button.y).toBeCloseTo(selected.anchor.y, 1);
    await page.getByRole('button', {name: 'Hide toggle'}).click();
    await expect(page.locator(buttonSelector)).toHaveCount(0);
    await expect(page.locator(anchorSelector)).toHaveCount(0);
});

for (const direction of ['ltr', 'rtl'] as const) {
    test(`collapse button geometry transition, reversal and disabling ${direction}`, async ({
        mount,
        page,
    }) => {
        await page.setViewportSize(viewport);
        await mount(
            <CollapseButtonExample
                direction={direction}
                initialCompact={false}
                footer="two-line"
                movingFooter
            />,
            undefined,
            viewport,
        );
        await finishAnimations(page);
        await page.evaluate(() => document.fonts.ready);
        const expanded = await geometry(page);
        await toggleAsideAndPause(page);
        await seekAnimations(page, 0.5);
        const middle = await geometry(page);
        expect(middle.slot.width).toBeGreaterThan(20);
        expect(middle.slot.width).toBeLessThan(24);
        expect(middle.radius).toBeGreaterThan(8);
        expect(middle.radius).toBeLessThan(12);
        expect(middle.panel.width).toBeGreaterThan(56);
        expect(middle.panel.width).toBeLessThan(236);
        const edgeOffset =
            direction === 'ltr'
                ? middle.panel.right - middle.slot.right
                : middle.slot.x - middle.panel.x;
        expect(edgeOffset).toBeGreaterThan(-10);
        expect(edgeOffset).toBeLessThan(12);
        await toggleAsideAndPause(page);
        await seekAnimations(page, 0);
        const reversed = await geometry(page);
        expect(reversed.button.y).toBeCloseTo(middle.button.y, 0);
        expect(reversed.slot.width).toBeCloseTo(middle.slot.width, 0);
        await finishAnimations(page);
        expect((await geometry(page)).slot).toEqual(expanded.slot);
        await toggleAsideAndPause(page);
        await seekAnimations(page, 0.5);
        await page
            .getByRole('button', {name: 'Toggle transition'})
            .evaluate((button: HTMLButtonElement) => button.click());
        await expect(page.locator(slotSelector)).toHaveCSS('transition-property', 'none');
        await expect(page.locator(slotSelector)).toHaveCSS('transform', 'none');
        const collapsed = await geometry(page);
        expect(collapsed.slot.width).toBe(20);
        expect(collapsed.slot.y - expanded.slot.y).toBeGreaterThan(40);
        expect(middle.slot.y).toBeCloseTo((expanded.slot.y + collapsed.slot.y) / 2, 0);
        await page.locator(buttonSelector).hover();
        await expect(page.locator(buttonSelector)).toHaveCSS('opacity', '1');
    });
}

test('collapse button honors reduced motion and raised aside z-index', async ({mount, page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.setViewportSize(viewport);
    await mount(<CollapseButtonExample initialCompact={false} raised />, undefined, viewport);
    await expect(page.locator('[data-gn-aside-collapse-layer]')).toHaveCSS('z-index', '351');
    await expect(page.locator(slotSelector)).toHaveCSS('transition-property', 'none');
    await expect(page.locator(buttonSelector)).toHaveCSS('transition-property', 'none');
    await page.locator(buttonSelector).click();
    expect((await geometry(page)).slot.width).toBe(20);
    await expect(page.locator(slotSelector)).toHaveCSS('transform', 'none');
    await page.getByRole('button', {name: 'Toggle custom panel', exact: true}).click();
    await finishAnimations(page);
    expect(
        await page.locator(buttonSelector).evaluate((button) => {
            const rect = button.getBoundingClientRect();
            return button.contains(
                document.elementFromPoint(rect.right - 3, rect.y + rect.height / 2),
            );
        }),
    ).toBe(true);
});

test('collapse button reselects after responsive CSS hides the anchor', async ({mount, page}) => {
    await page.setViewportSize(viewport);
    await mount(<CollapseButtonExample responsiveFooter />, undefined, {width: '100%'});
    await expect(page.locator(anchorSelector)).toHaveAttribute(
        'data-gn-composite-bar-item-id',
        'account',
    );
    await page.setViewportSize({width: 850, height: 720});
    await expect(page.locator(anchorSelector)).toHaveAttribute(
        'data-gn-composite-bar-item-id',
        'settings',
    );
    await expect
        .poll(async () => {
            const current = await geometry(page);
            if (!current.anchor) throw new Error('Missing responsive anchor');
            return current.button.y - current.anchor.y;
        })
        .toBeCloseTo(0, 1);
});

test.describe('collapse button on touch devices', () => {
    test.use({hasTouch: true});
    test('shows the RTL tab without an appearance offset', async ({mount, page}) => {
        await page.setViewportSize(viewport);
        await mount(<CollapseButtonExample direction="rtl" />, undefined, viewport);
        await expect(page.locator(buttonSelector)).toHaveCSS('opacity', '1');
        await expect(page.locator(buttonSelector)).toHaveCSS('transform', 'none');
        const current = await geometry(page);
        expect(current.panel.x - current.button.x).toBeCloseTo(10, 1);
    });
});

test('collapse button preserves keyboard focus, row actions, popup and highlighted copies', async ({
    mount,
    page,
}) => {
    await page.setViewportSize(viewport);
    await mount(<CollapseButtonExample />, undefined, viewport);
    const button = page.locator(buttonSelector);
    await page.locator(anchorSelector).focus();
    await page.keyboard.press('Tab');
    await expect(button).toBeFocused();
    const original = await button.elementHandle();
    if (!original) throw new Error('Missing persistent button');
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Space');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
    expect(await original.evaluate((element) => element.isConnected)).toBe(true);
    await expect(page.getByRole('status', {name: 'Compact changes'})).toHaveText('2');
    await expect(page.getByRole('status', {name: 'Footer actions'})).toHaveText('0');
    await finishAnimations(page);
    await page.locator(anchorSelector).click();
    await expect(page.getByRole('status', {name: 'Footer actions'})).toHaveText('1');
    await page.getByRole('button', {name: 'Toggle popup'}).click();
    await expect(page.getByText('Consumer popup')).toBeVisible();
    await button.evaluate((element: HTMLButtonElement) => element.click());
    await expect(page.getByText('Consumer popup')).toBeVisible();
    await expect(page.locator('[data-gn-aside-collapse-layer]')).toHaveCSS('z-index', '101');
    await page.getByRole('button', {name: 'Toggle popup'}).click();
    await page.getByRole('button', {name: 'Toggle modal'}).click();
    await expect(page.locator('.gn-composite-bar-highlighted-item')).toHaveCount(2);
    await expect(page.locator(anchorSelector)).toHaveCount(1);
    await expect(
        page.locator('.gn-composite-bar-highlighted-item').locator(anchorSelector),
    ).toHaveCount(0);
});
