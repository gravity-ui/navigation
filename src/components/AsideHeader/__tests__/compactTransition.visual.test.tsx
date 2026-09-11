/* Playwright queries are page-scoped, not Testing Library render queries. */
/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';

import {expect} from '@playwright/experimental-ct-react';
import type {Page} from '@playwright/test';

import {test} from '~playwright/core';

import {
    CompactTransitionExample,
    CompactTransitionIsolationExample,
} from '../__playwright__/CompactTransitionExample';
import {finishAnimations, seekAnimations} from '../__playwright__/transitionTestUtils';

async function clickAndFrame(page: Page, label: string) {
    await page.evaluate(() => document.fonts.ready);
    await page
        .getByRole('button', {name: label, exact: true, includeHidden: true})
        .evaluate(async (button) => {
            button.click();
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            document.getAnimations().forEach((animation) => animation.pause());
        });
}

async function geometry(page: Page) {
    return page.evaluate(() => {
        const panel = document.querySelector<HTMLElement>('[data-gn-aside-panel]');
        if (!panel) throw new Error('Aside panel missing');

        const rect = (element: Element) => {
            const {x, y, width, height} = element.getBoundingClientRect();
            return {x, y, width, height};
        };
        return {
            panel: rect(panel),
            layoutWidth: panel.parentElement?.getBoundingClientRect().width,
            rows: Array.from(
                panel.querySelectorAll(
                    '[data-gn-composite-bar-item-id], [data-gn-aside-divider], [data-gn-aside-part="surface"]',
                ),
                rect,
            ),
            resources: document.querySelectorAll(
                '[data-gn-aside-animating], [data-gn-aside-transition-overlay], [data-gn-aside-current-indicator-layer], [data-gn-aside-current-suppressed]',
            ).length,
            animations: document
                .getAnimations()
                // Drawer item transforms belong to independent opening/closing.
                .filter(
                    (animation) =>
                        !((animation.effect as KeyframeEffect).target as Element)?.matches(
                            '.g-drawer__item',
                        ),
                )
                .filter(
                    (animation) =>
                        !(
                            animation instanceof CSSTransition &&
                            (['opacity', 'background-color'].includes(
                                animation.transitionProperty,
                            ) ||
                                // The inner button's 2px appearance motion is independent from
                                // compact geometry. Slot Y/width/inset animations remain checked.
                                (animation.transitionProperty === 'transform' &&
                                    (
                                        (animation.effect as KeyframeEffect).target as Element
                                    )?.matches('button[class*="gn-collapse-button_"]')))
                        ),
                )
                .map((animation) => ({
                    target: ((animation.effect as KeyframeEffect).target as Element)?.className,
                    frames: (animation.effect as KeyframeEffect).getKeyframes(),
                })),
            targets: Array.from(
                document.querySelectorAll(
                    '[data-gn-aside-panel], [class*="__aside-custom-background_"], [class*="gn-aside-header__content_"], .g-drawer[data-floating-ui-status]',
                ),
                (element) => ({
                    rect: rect(element),
                    transition: getComputedStyle(element).transitionProperty,
                }),
            ),
        };
    });
}

for (const layout of ['aside', 'page', 'fallback'] as const) {
    for (const menuDensity of ['default', 'compact'] as const) {
        for (const initialCompact of [false, true]) {
            test(`disabled compact transition settles first frame (${layout}, ${menuDensity}, ${initialCompact})`, async ({
                mount,
                page,
            }) => {
                await mount(
                    <CompactTransitionExample {...{layout, menuDensity, initialCompact}} />,
                );
                await finishAnimations(page);
                await page.evaluate(() => document.fonts.ready);
                await clickAndFrame(page, 'Toggle compact');
                const first = await geometry(page);
                expect(first.panel.width).toBe(
                    (menuDensity === 'default' ? [56, 236] : [44, 220])[Number(initialCompact)],
                );
                expect(first.resources).toBe(0);
                expect(first.animations).toEqual([]);
                expect(first.targets).toHaveLength(layout === 'fallback' ? 2 : 4);
                const content = first.targets[layout === 'fallback' ? 1 : 2];
                expect(content.rect.width + first.panel.width).toBeCloseTo(
                    first.layoutWidth ?? 0,
                    1,
                );
                if (layout !== 'fallback') {
                    expect(first.targets[1].rect.width).toBe(first.panel.width);
                    expect(first.targets[3].rect.x).toBe(first.panel.width);
                }
                first.targets.forEach(({transition}) =>
                    expect(['none', 'background-color']).toContain(transition),
                );
                await finishAnimations(page);
                expect(await geometry(page)).toEqual(first);
            });
        }
    }
}

for (const grouped of [false, true]) {
    test(`disabling mid-transition releases geometry and current paint (grouped=${grouped})`, async ({
        mount,
        page,
    }) => {
        await mount(<CompactTransitionExample initialTransition grouped={grouped} />);
        await finishAnimations(page);
        await clickAndFrame(page, 'Toggle compact');
        await seekAnimations(page, 0.5);
        const middle = await geometry(page);
        expect(middle.panel.width).toBeGreaterThan(56);
        expect(middle.panel.width).toBeLessThan(236);
        expect(middle.resources).toBeGreaterThan(0);
        await expect(page.locator('[data-gn-aside-current-indicator]')).toHaveCount(
            grouped ? 1 : 0,
        );
        await clickAndFrame(page, 'Toggle transition');
        const disabled = await geometry(page);
        expect(disabled.panel.width).toBe(56);
        expect(disabled.resources).toBe(0);
        expect(disabled.animations).toEqual([]);
        await finishAnimations(page);
        expect(await geometry(page)).toEqual(disabled);
        await clickAndFrame(page, 'Toggle transition');
        const enabled = await geometry(page);
        expect(enabled.panel).toEqual(disabled.panel);
        expect(enabled.rows).toEqual(disabled.rows);
        expect(enabled.resources).toBe(0);
        expect(enabled.animations).toEqual([]);
        expect(enabled.targets.at(-1)?.transition).toBe('left, background-color');
    });
}

for (const initialTransition of [false, true]) {
    test(`joint flag and compact update uses new flag (initial=${initialTransition})`, async ({
        mount,
        page,
    }) => {
        await mount(<CompactTransitionExample initialTransition={initialTransition} />);
        await finishAnimations(page);
        await clickAndFrame(page, 'Toggle both');
        const first = await geometry(page);
        if (initialTransition) {
            expect(first.panel.width).toBe(56);
            expect(first.resources).toBe(0);
        } else {
            expect(first.panel.width).toBeGreaterThan(56);
            expect(first.resources).toBeGreaterThan(0);
        }
        await finishAnimations(page);
    });

    test(`reduced motion preserves precedence on all four targets (enabled=${initialTransition})`, async ({
        mount,
        page,
    }) => {
        await page.emulateMedia({reducedMotion: 'reduce'});
        await mount(<CompactTransitionExample initialTransition={initialTransition} />);
        await finishAnimations(page);
        await clickAndFrame(page, 'Toggle compact');
        const first = await geometry(page);
        expect(first.targets).toHaveLength(4);
        first.targets.forEach(({transition}) => expect(transition).toBe('none'));
        expect(first.panel.width).toBe(56);
        expect(first.resources).toBe(0);
        expect(first.animations).toEqual([]);
    });
}

for (const menuDensity of ['default', 'compact'] as const) {
    for (const initialCompact of [false, true]) {
        test(`RTL disabled transition settles immediately (${menuDensity}, ${initialCompact})`, async ({
            mount,
            page,
        }) => {
            await mount(
                <CompactTransitionExample {...{menuDensity, initialCompact}} direction="rtl" />,
            );
            await finishAnimations(page);
            await expect(page.locator('[data-gn-aside-panel]')).toHaveCSS('direction', 'rtl');
            await clickAndFrame(page, 'Toggle compact');
            const first = await geometry(page);
            expect(first.panel.width).toBe(
                (menuDensity === 'default' ? [56, 236] : [44, 220])[Number(initialCompact)],
            );
            expect(first.resources).toBe(0);
            expect(first.animations).toEqual([]);
            await finishAnimations(page);
            expect(await geometry(page)).toEqual(first);
        });
    }
}

test('nested layout resets an inherited disabled transition', async ({mount, page}) => {
    await mount(<CompactTransitionIsolationExample />);
    await expect(page.getByTestId('outer-fallback')).toHaveCSS('transition-property', 'none');
    await expect(page.getByTestId('inner-fallback')).toHaveCSS('transition-property', 'width');
    await expect(page.getByTestId('inner-fallback')).toHaveCSS('transition-duration', '0.2s');
});

test('keeps children, focus, callbacks and independent Drawer transitions', async ({
    mount,
    page,
}) => {
    const warnings: string[] = [];
    page.on('console', (message) => {
        if (message.type() === 'error') warnings.push(message.text());
    });
    await mount(<CompactTransitionExample />);
    await finishAnimations(page);

    // Observe the Drawer opening, not closing: closing unmounts the item on a timer, so a
    // single stalled frame outlives the whole 300ms transform and leaves nothing to sample.
    // Overriding the duration the Drawer sets inline keeps the opening transition running
    // until it is observed, whatever the frame rate.
    await clickAndFrame(page, 'Toggle drawer');
    await finishAnimations(page);
    const slowDrawer = await page.addStyleTag({
        content: '.g-drawer { --_--animation-duration: 10s !important; }',
    });
    await page
        .getByRole('button', {name: 'Toggle drawer', exact: true, includeHidden: true})
        .evaluate((button) => button.click());
    await expect
        .poll(() =>
            page.evaluate(
                () =>
                    document.getAnimations().filter((animation) => {
                        const target = (animation.effect as KeyframeEffect).target;
                        return target instanceof Element && target.matches('.g-drawer__item');
                    }).length,
            ),
        )
        .toBeGreaterThan(0);
    await slowDrawer.evaluate((tag) => tag.remove());
    await finishAnimations(page);
    // Close it again: the open overlay hides the page content from the accessibility tree.
    await clickAndFrame(page, 'Toggle drawer');
    await finishAnimations(page);
    const input = page.getByRole('textbox', {name: 'Persistent input'});
    await input.fill('Local state');
    await input.focus();
    const original = await input.elementHandle();
    if (!original) throw new Error('Persistent input missing');
    for (const label of ['Toggle transition', 'Toggle transition', 'Toggle compact']) {
        await clickAndFrame(page, label);
        await expect(input).toBeFocused();
        await expect(input).toHaveValue('Local state');
        expect(
            await original.evaluate(
                (element) =>
                    element === document.querySelector('input[aria-label="Persistent input"]'),
            ),
        ).toBe(true);
    }
    await expect(page.getByRole('status', {name: 'Compact changes'})).toHaveText('0');
    await page.locator('button[class*="gn-collapse-button_"]').click();
    await expect(page.getByRole('status', {name: 'Compact changes'})).toHaveText('1');
    await expect(page.locator('[compacttransition]')).toHaveCount(0);
    expect(warnings.filter((warning) => /compactTransition|unknown.prop/i.test(warning))).toEqual(
        [],
    );
    await clickAndFrame(page, 'Toggle drawer');
    await expect
        .poll(() =>
            page.evaluate(() => {
                const animations = document.getAnimations().filter((animation) => {
                    const target = (animation.effect as KeyframeEffect).target;
                    return target instanceof Element && target.matches('.g-drawer__item');
                });
                animations.forEach((animation) => animation.pause());
                return animations.length;
            }),
        )
        .toBeGreaterThan(0);
    await finishAnimations(page);
    await expect(page.getByText('Drawer content', {exact: true})).toBeVisible();
});

test('preserves footer and scrollbar opacity and hover styling when only the flag changes', async ({
    mount,
    page,
}) => {
    await page.setViewportSize({width: 1200, height: 400});
    await mount(<CompactTransitionExample initialTransition overflowing />);
    await finishAnimations(page);
    await clickAndFrame(page, 'Toggle drawer');
    await finishAnimations(page);
    const item = page.getByRole('button', {name: 'Other item', exact: true});
    await item.hover();
    await expect(page.locator('[class*="__scrollbar-thumb_"]')).toHaveCount(1);
    const styles = () =>
        page.evaluate(() => {
            const footer = document.querySelector('[class*="gn-aside-header__footer-divider_"]');
            const surface = document.querySelector(
                '[data-gn-composite-bar-item-id="other"] [data-gn-aside-part="surface"]',
            );
            const scrollbar = document.querySelector('[class*="__scrollbar-thumb_"]');
            if (!footer || !surface || !scrollbar) throw new Error('Effect target missing');
            return {
                footer: getComputedStyle(footer).transition,
                scrollbar: getComputedStyle(scrollbar).transition,
                hover: getComputedStyle(surface).backgroundColor,
            };
        });
    const before = await styles();
    expect(before.footer).toContain('opacity 0.3s');
    expect(before.scrollbar).toContain('opacity 0.15s');
    await clickAndFrame(page, 'Toggle transition');
    expect(await styles()).toEqual(before);
});
