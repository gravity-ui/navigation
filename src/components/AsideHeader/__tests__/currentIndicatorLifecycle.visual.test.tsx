import React from 'react';

import {expect} from '@playwright/experimental-ct-react';
import type {Locator, Page} from '@playwright/test';

import {test} from '~playwright/core';

import {CurrentIndicatorExample} from '../__playwright__/CurrentIndicatorExample';
import {
    finishAnimations,
    seekAnimations,
    toggleAsideAndPause,
} from '../__playwright__/transitionTestUtils';

const MENU = '[id="gravity-ui/navigation-menu-items-composite-bar"]';
const SURFACE = '[data-gn-aside-part="surface"]';
const HOME = `${MENU} [data-gn-composite-bar-item-id="home"]`;
const GROUP = `${MENU} [data-gn-composite-bar-item-id="__gn-composite-bar__group-header__analytics"]`;
const INDICATOR = '[data-gn-aside-current-indicator]';
const PANEL = '[data-gn-aside-panel]';

async function paintEffectCount(surface: Locator) {
    return surface.evaluate(
        (element) =>
            element
                .getAnimations()
                .filter((animation) =>
                    (animation.effect as KeyframeEffect)
                        .getKeyframes()
                        .some((frame) =>
                            Object.prototype.hasOwnProperty.call(frame, 'backgroundColor'),
                        ),
                ).length,
    );
}

async function collapseWithHomeHover(page: Page) {
    await page.evaluate(() => document.fonts.ready);
    await page.locator(HOME).hover();
    await expect(page.locator(`${HOME} ${SURFACE}`)).toHaveCSS(
        'background-color',
        'rgb(120, 120, 120)',
    );
    await toggleAsideAndPause(page);
    await seekAnimations(page, 0.5);
    expect(await paintEffectCount(page.locator(`${HOME} ${SURFACE}`))).toBe(1);
}

test('native-paint-only compact transition observes later current changes', async ({
    mount,
    page,
}) => {
    await page.setViewportSize({width: 1200, height: 900});
    await mount(
        <CurrentIndicatorExample
            mode="plain"
            initialCurrentId="analytics-overview"
            hoverColor="rgb(120, 120, 120)"
        />,
    );
    await collapseWithHomeHover(page);
    await expect(page.locator(INDICATOR)).toHaveCount(0);
    await page
        .locator('[data-qa="indicator-change-top-level-current"]')
        .evaluate((button) => button.click());
    await expect(page.locator(`${HOME} ${SURFACE}`)).toHaveCSS(
        'background-color',
        'rgb(17, 85, 221)',
    );
    expect(await paintEffectCount(page.locator(`${HOME} ${SURFACE}`))).toBe(0);
    await expect(page.locator(PANEL)).toHaveAttribute('data-gn-aside-animating', '');
    await finishAnimations(page);
});

test('last-transfer cancellation keeps unrelated paint observed until a later current change', async ({
    mount,
    page,
}) => {
    await page.setViewportSize({width: 1200, height: 900});
    await mount(<CurrentIndicatorExample hoverColor="rgb(120, 120, 120)" />);
    await collapseWithHomeHover(page);
    await expect(page.locator(INDICATOR)).toHaveCount(1);
    await page.locator('[data-qa="indicator-change-current"]').evaluate((button) => button.click());
    await expect(page.locator(INDICATOR)).toHaveCount(0);
    expect(await paintEffectCount(page.locator(`${HOME} ${SURFACE}`))).toBe(1);
    await page
        .locator('[data-qa="indicator-change-top-level-current"]')
        .evaluate((button) => button.click());
    await expect(page.locator(`${HOME} ${SURFACE}`)).toHaveCSS(
        'background-color',
        'rgb(17, 85, 221)',
    );
    expect(await paintEffectCount(page.locator(`${HOME} ${SURFACE}`))).toBe(0);
    await expect(page.locator(PANEL)).toHaveAttribute('data-gn-aside-animating', '');
    await finishAnimations(page);
});

test('released current surface retains its native in-flight geometry', async ({mount, page}) => {
    await page.setViewportSize({width: 1200, height: 900});
    await mount(<CurrentIndicatorExample />);
    await page.evaluate(() => document.fonts.ready);
    const surface = page.locator(`${GROUP} ${SURFACE}`);
    const expanded = await surface.boundingBox();
    if (!expanded) throw new Error('Expanded group surface missing');
    await toggleAsideAndPause(page);
    await seekAnimations(page, 0.5);
    await expect(page.locator(INDICATOR)).toHaveCount(1);
    await page.locator('[data-qa="indicator-add-current"]').evaluate((button) => button.click());
    await expect(page.locator(INDICATOR)).toHaveCount(0);
    await expect(surface).toHaveCSS('background-color', 'rgb(17, 85, 221)');
    const middle = await surface.boundingBox();
    if (!middle) throw new Error('Released group surface missing');
    await seekAnimations(page, 1);
    const compact = await surface.boundingBox();
    if (!compact) throw new Error('Compact group surface missing');
    expect(middle.width).toBeGreaterThan(compact.width + 1);
    expect(middle.width).toBeLessThan(expanded.width - 1);
    expect(middle.width).toBeCloseTo((expanded.width + compact.width) / 2, 1);
    await finishAnimations(page);
});

test('batched reversal rejecting an ambiguous transfer restores native snapshot paint', async ({
    mount,
    page,
}) => {
    await page.setViewportSize({width: 1200, height: 900});
    await mount(<CurrentIndicatorExample />);
    await page.evaluate(() => document.fonts.ready);
    await toggleAsideAndPause(page);
    await seekAnimations(page, 0.5);
    await expect(page.locator(INDICATOR)).toHaveCount(1);
    await page.locator('[data-qa="indicator-reverse-ambiguous"]').evaluate(async (button) => {
        button.click();
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        document.getAnimations().forEach((animation) => animation.pause());
    });
    await seekAnimations(page, 0);
    await expect(page.locator(GROUP)).toHaveAttribute(
        'data-gn-aside-current-ids',
        '["analytics-dashboards","analytics-reports"]',
    );
    await expect(page.locator(INDICATOR)).toHaveCount(0);
    await expect(page.locator(`${GROUP} ${SURFACE}`)).toHaveCSS(
        'background-color',
        'rgb(17, 85, 221)',
    );
    expect(await paintEffectCount(page.locator(`${GROUP} ${SURFACE}`))).toBe(0);
    await expect(page.locator(PANEL)).toHaveAttribute('data-gn-aside-animating', '');
    await finishAnimations(page);
});
