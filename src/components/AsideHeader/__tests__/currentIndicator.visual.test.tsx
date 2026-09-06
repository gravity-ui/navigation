import React from 'react';

import {expect} from '@playwright/experimental-ct-react';
import type {Locator, Page} from '@playwright/test';

import {test} from '~playwright/core';

import {CurrentIndicatorExample} from '../__playwright__/CurrentIndicatorExample';
import {type PaintBox, comparePaint, selectionPaint} from '../__playwright__/currentIndicatorPaint';
import {
    finishAnimations,
    seekAnimations,
    toggleAsideAndPause,
} from '../__playwright__/transitionTestUtils';

import {AsideHeaderExamplesStories} from './helpersPlaywright';

const MENU = '[id="gravity-ui/navigation-menu-items-composite-bar"]';
const SURFACE = '[data-gn-aside-part="surface"]';
const INDICATOR = '[data-gn-aside-current-indicator]';
const CHILD = `${MENU} [data-gn-composite-bar-item-id="analytics-dashboards"]`;
const GROUP = `${MENU} [data-gn-composite-bar-item-id="__gn-composite-bar__group-header__analytics"]`;
const QUICK = '[id="gravity-ui/navigation-quick-access-composite-bar"]';
const LAYER = '[data-gn-aside-current-indicator-layer]';
const PANEL = '[data-gn-aside-panel]';
const SCROLL = '[data-gn-aside-scrollport]';
const PARTICIPATING =
    '[data-gn-aside-current-suppressed], [data-gn-aside-current-ghost-suppressed]';

function intersection(a: PaintBox, b: PaintBox): PaintBox {
    const x = Math.max(a.x, b.x);
    const y = Math.max(a.y, b.y);
    return {
        x,
        y,
        width: Math.max(0, Math.min(a.x + a.width, b.x + b.width) - x),
        height: Math.max(0, Math.min(a.y + a.height, b.y + b.height) - y),
    };
}

async function nativePaintDifference(page: Page) {
    const surfaces = page.locator(PARTICIPATING);
    const originals = await surfaces.evaluateAll((elements) =>
        elements.map((element) => element.getAttribute('style')),
    );
    const layer = page.locator(LAYER);
    const layerStyle = await layer.getAttribute('style');
    const area = await box(page.locator(PANEL));
    try {
        await layer.evaluate((element) =>
            (element as HTMLElement).style.setProperty('visibility', 'hidden'),
        );
        const actual = await page.screenshot({animations: 'allow', scale: 'css'});
        await surfaces.evaluateAll((elements) =>
            elements.forEach((element) =>
                (element as HTMLElement).style.setProperty(
                    'background-color',
                    'transparent',
                    'important',
                ),
            ),
        );
        const transparentControl = await page.screenshot({animations: 'allow', scale: 'css'});
        return (await comparePaint(page, transparentControl, actual, [area]))[0].changedPixels;
    } finally {
        await surfaces.evaluateAll(
            (elements, styles) =>
                elements.forEach((element, index) => {
                    if (styles[index] === null) element.removeAttribute('style');
                    else element.setAttribute('style', styles[index] ?? '');
                }),
            originals,
        );
        await layer.evaluate((element, style) => {
            if (style === null) element.removeAttribute('style');
            else element.setAttribute('style', style);
        }, layerStyle);
    }
}

async function expectNativePaintSuppressed(page: Page, initialCompact: boolean) {
    const child = initialCompact
        ? page.locator(`${CHILD} ${SURFACE}`)
        : page.locator(
              `[data-gn-aside-transition-overlay] [aria-label="Weekly operational performance"] ${SURFACE}`,
          );
    await expect(page.locator(`${GROUP} ${SURFACE}`)).toHaveCSS(
        'background-color',
        'rgba(0, 0, 0, 0)',
    );
    await expect(child).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(page.locator(PARTICIPATING)).not.toHaveCount(0);
    expect(
        await page
            .locator(PARTICIPATING)
            .evaluateAll((elements) =>
                elements.every(
                    (element) => getComputedStyle(element).backgroundColor === 'rgba(0, 0, 0, 0)',
                ),
            ),
    ).toBe(true);
    expect(await nativePaintDifference(page)).toBe(0);
}

async function namedForegroundPaint(page: Page) {
    const moving = await box(page.locator(INDICATOR));
    const regions = [
        page.locator(
            `${MENU} [data-gn-composite-bar-item-id="analytics-overview"] [data-gn-aside-part="title"]`,
        ),
        page.locator(`${GROUP} [data-gn-aside-part="icon"] svg.g-icon`),
    ];
    const areas = await Promise.all(
        regions.map(async (region) => intersection(await box(region), moving)),
    );
    areas.forEach((area) => {
        expect(area.width).toBeGreaterThan(0);
        expect(area.height).toBeGreaterThan(0);
    });
    const layer = page.locator(LAYER);
    const original = await layer.getAttribute('style');
    try {
        await layer.evaluate((element) =>
            (element as HTMLElement).style.setProperty('visibility', 'hidden'),
        );
        const foreground = await page.screenshot({animations: 'allow', scale: 'css'});
        await layer.evaluate((element) =>
            (element as HTMLElement).style.removeProperty('visibility'),
        );
        const actual = await page.screenshot({animations: 'allow', scale: 'css'});
        await layer.evaluate((element) =>
            (element as HTMLElement).style.setProperty('z-index', '100'),
        );
        const aboveTextControl = await page.screenshot({animations: 'allow', scale: 'css'});
        return {
            actual: await comparePaint(page, foreground, actual, areas),
            aboveTextControl: await comparePaint(page, foreground, aboveTextControl, areas),
        };
    } finally {
        await layer.evaluate((element, style) => {
            if (style === null) element.removeAttribute('style');
            else element.setAttribute('style', style);
        }, original);
    }
}

async function expectNoLayerOverflow(page: Page) {
    const metrics = await page.locator(SCROLL).evaluate((element) => {
        const layer = element.querySelector<HTMLElement>('[data-gn-aside-current-indicator-layer]');
        if (!layer) throw new Error('Indicator layer missing');
        const measure = () => ({
            height: element.scrollHeight,
            width: element.scrollWidth,
            clientHeight: element.clientHeight,
            clientWidth: element.clientWidth,
            footer: document.querySelector('[class*="gn-aside-header__footer"]')?.className,
            scrollbar: element.parentElement?.className,
        });
        const withLayer = measure();
        const original = layer.style.display;
        layer.style.display = 'none';
        const withoutLayer = measure();
        layer.style.display = original;
        return {withLayer, withoutLayer};
    });
    expect(metrics.withLayer).toEqual(metrics.withoutLayer);
}

async function expectClippedAtBoundary(page: Page, boundary: 'header' | 'footer') {
    const moving = await box(page.locator(INDICATOR));
    const viewport = await box(page.locator(SCROLL));
    const edge = boundary === 'header' ? viewport.y : viewport.y + viewport.height;
    expect(moving.y, `${boundary} crossing top`).toBeLessThan(edge - 2);
    expect(moving.y + moving.height, `${boundary} crossing bottom`).toBeGreaterThan(edge + 2);
    const panel = await box(page.locator(PANEL));
    const outside =
        boundary === 'header'
            ? {x: panel.x, y: panel.y, width: panel.width, height: Math.floor(edge) - panel.y}
            : {
                  x: panel.x,
                  y: Math.ceil(edge),
                  width: panel.width,
                  height: panel.y + panel.height - Math.ceil(edge),
              };
    expect((await selectionPaint(page, outside)).selectionPixels).toBe(0);
    await expectOnlyIndicatorPaint(page);
    await expectNoLayerOverflow(page);
}

function expectMidpoint(
    middle: Awaited<ReturnType<typeof geometry>>,
    source: Awaited<ReturnType<typeof geometry>>,
    target: Awaited<ReturnType<typeof geometry>>,
) {
    for (const field of ['x', 'y', 'width', 'height', 'radius'] as const) {
        const low = Math.min(source[field], target[field]);
        const high = Math.max(source[field], target[field]);
        if (high - low > 0.1) {
            expect(middle[field], field).toBeGreaterThan(low);
            expect(middle[field], field).toBeLessThan(high);
        } else {
            expect(middle[field], `${field} unchanged`).toBeCloseTo(source[field], 1);
        }
        expect(
            Math.abs(middle[field] - (source[field] + target[field]) / 2),
            field,
        ).toBeLessThanOrEqual(0.6);
    }
}

async function box(locator: Locator) {
    const result = await locator.boundingBox();
    if (!result) throw new Error(`Missing rectangle: ${locator}`);
    return result;
}

async function geometry(locator: Locator) {
    return {
        ...(await box(locator)),
        radius: await locator.evaluate((element) =>
            Number.parseFloat(getComputedStyle(element).borderTopLeftRadius),
        ),
    };
}

function expectGeometryNear(
    actual: Awaited<ReturnType<typeof geometry>>,
    expected: Awaited<ReturnType<typeof geometry>>,
) {
    for (const field of ['x', 'y', 'width', 'height', 'radius'] as const) {
        expect(Math.abs(actual[field] - expected[field]), field).toBeLessThanOrEqual(0.6);
    }
}

async function expectOnlyIndicatorPaint(page: Page) {
    const panel = await box(page.locator(PANEL));
    const scroll = await box(page.locator(SCROLL));
    const moving = await box(page.locator(INDICATOR));
    const visible = intersection(intersection(panel, scroll), moving);
    expect(visible.width).toBeGreaterThan(0);
    expect(visible.height).toBeGreaterThan(0);
    const paint = await selectionPaint(page, {
        x: Math.max(panel.x, scroll.x),
        y: scroll.y,
        width: Math.max(
            0,
            Math.min(panel.x + panel.width, scroll.x + scroll.width) - Math.max(panel.x, scroll.x),
        ),
        height: scroll.height,
    });
    expect(paint.selectionPixels).toBeGreaterThan(200);
    if (!paint.bounds) throw new Error('No opaque selection pixels');
    expect(Math.abs(paint.bounds.y - visible.y)).toBeLessThanOrEqual(2);
    expect(Math.abs(paint.bounds.height - visible.height)).toBeLessThanOrEqual(2);
    expect(Math.abs(paint.bounds.x - visible.x)).toBeLessThanOrEqual(2);
    expect(Math.abs(paint.bounds.width - visible.width)).toBeLessThanOrEqual(2);
}

test('screenshot paint helpers keep empty and required-region contracts distinct', async ({
    mount,
    page,
}) => {
    await page.setViewportSize({width: 200, height: 160});
    await mount(
        <div
            data-qa="paint-helper-blue"
            style={{
                position: 'fixed',
                left: 20,
                top: 30,
                width: 40,
                height: 24,
                background: 'rgb(17, 85, 221)',
            }}
        />,
    );
    const screenshot = await page.screenshot({animations: 'allow', scale: 'css'});
    const outside = {x: 300, y: 300, width: 20, height: 20};
    await expect(
        comparePaint(page, screenshot, screenshot, [{x: 20, y: 30, width: 0, height: 24}, outside]),
    ).resolves.toEqual([
        {changedPixels: 0, inkPixels: 0, retainedInkPixels: 0},
        {changedPixels: 0, inkPixels: 0, retainedInkPixels: 0},
    ]);
    await expect(selectionPaint(page, outside)).rejects.toThrow(
        'Screenshot sample is outside viewport',
    );

    const blue = await box(page.locator('[data-qa="paint-helper-blue"]'));
    const paint = await selectionPaint(page, blue);
    expect(paint.selectionPixels).toBe(blue.width * blue.height);
    expect(paint.bounds).toEqual(blue);
});

for (const menuDensity of ['default', 'compact'] as const) {
    for (const initialCompact of [false, true]) {
        const direction = initialCompact ? 'expand' : 'collapse';
        test(`${menuDensity} density ${direction} interpolates geometry and reverses from painted position`, async ({
            mount,
            page,
        }, testInfo) => {
            await page.setViewportSize({width: 1200, height: 900});
            await mount(
                <CurrentIndicatorExample
                    menuDensity={menuDensity}
                    initialCompact={initialCompact}
                />,
            );
            await page.evaluate(() => document.fonts.ready);
            const sourceSelector = `${initialCompact ? GROUP : CHILD} ${SURFACE}`;
            const targetSelector = `${initialCompact ? CHILD : GROUP} ${SURFACE}`;
            const source = await geometry(page.locator(sourceSelector));
            const sourcePanelWidth = (await box(page.locator(PANEL))).width;
            await toggleAsideAndPause(page);
            await seekAnimations(page, 0);
            const indicator = page.locator(INDICATOR);
            await expect(indicator).toHaveCount(1);
            expectGeometryNear(await geometry(indicator), source);
            await seekAnimations(page, 0.5);
            const midpointPanelWidth = (await box(page.locator(PANEL))).width;
            const targetPanelWidth = await page
                .locator(PANEL)
                .evaluate((element) => Number.parseFloat((element as HTMLElement).style.width));
            expect(midpointPanelWidth).toBeGreaterThan(
                Math.min(sourcePanelWidth, targetPanelWidth),
            );
            expect(midpointPanelWidth).toBeLessThan(Math.max(sourcePanelWidth, targetPanelWidth));
            const middle = await geometry(indicator);
            await expect(indicator).toHaveCSS('opacity', '1');
            await expect(page.locator(`${GROUP} ${SURFACE}`)).toHaveCSS(
                'background-color',
                'rgba(0, 0, 0, 0)',
            );
            await expectOnlyIndicatorPaint(page);
            await expectNativePaintSuppressed(page, initialCompact);
            await page.screenshot({
                path: testInfo.outputPath(`${direction}-${menuDensity}-midpoint.png`),
                animations: 'allow',
                scale: 'css',
            });
            await seekAnimations(page, 1);
            const target = await geometry(page.locator(targetSelector));
            expectGeometryNear(await geometry(indicator), target);
            expectMidpoint(middle, source, target);
            await finishAnimations(page);
            await expect(indicator).toHaveCount(0);
            expectGeometryNear(await geometry(page.locator(targetSelector)), target);

            await toggleAsideAndPause(page);
            await seekAnimations(page, 0.5);
            const reversalSource = await geometry(indicator);
            const reversalPanelWidth = (await box(page.locator(PANEL))).width;
            await toggleAsideAndPause(page);
            await seekAnimations(page, 0);
            await expect(indicator).toHaveCount(1);
            expectGeometryNear(await geometry(indicator), reversalSource);
            await seekAnimations(page, 0.5);
            const reversalMiddle = await geometry(indicator);
            expectMidpoint(reversalMiddle, reversalSource, target);
            const reversalMiddleWidth = (await box(page.locator(PANEL))).width;
            expect(reversalMiddleWidth).toBeGreaterThan(
                Math.min(reversalPanelWidth, targetPanelWidth),
            );
            expect(reversalMiddleWidth).toBeLessThan(
                Math.max(reversalPanelWidth, targetPanelWidth),
            );
            await expectOnlyIndicatorPaint(page);
            await expectNativePaintSuppressed(page, initialCompact);
            await seekAnimations(page, 1);
            const end = await geometry(indicator);
            const native = await geometry(page.locator(targetSelector));
            expectGeometryNear(end, native);
            await finishAnimations(page);
            await expect(indicator).toHaveCount(0);
            expectGeometryNear(await geometry(page.locator(targetSelector)), native);
            await expect(page.locator(targetSelector)).toHaveCSS(
                'background-color',
                'rgb(17, 85, 221)',
            );
        });
    }
}

for (const initialCompact of [false, true]) {
    const direction = initialCompact ? 'expand' : 'collapse';
    test(`RTL ${direction} uses the full scrollport layer without adding overflow`, async ({
        mount,
        page,
    }) => {
        await page.setViewportSize({width: 1200, height: 900});
        await mount(<CurrentIndicatorExample initialCompact={initialCompact} direction="rtl" />);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator(PANEL)).toHaveCSS('direction', 'rtl');
        await toggleAsideAndPause(page);
        for (const progress of [0, 0.5, 0.9]) {
            await seekAnimations(page, progress);
            await expect(page.locator(INDICATOR)).toHaveCount(1);
            const layer = await box(page.locator(LAYER));
            const scroll = await box(page.locator(SCROLL));
            expect(layer.x).toBeCloseTo(scroll.x, 1);
            expect(layer.x + layer.width).toBeCloseTo(scroll.x + scroll.width, 1);
            if (!initialCompact && progress === 0) {
                const host = await box(
                    page.locator(`${SCROLL} > [data-gn-aside-current-container]`),
                );
                expect(host.width).toBeLessThan(scroll.width);
            }
            await expectOnlyIndicatorPaint(page);
            await expectNoLayerOverflow(page);
        }
        await finishAnimations(page);
    });
}

for (const menuDensity of ['default', 'compact'] as const) {
    test(`${menuDensity} density compact current and hover use suppressible surface color`, async ({
        mount,
        page,
    }) => {
        await mount(
            <CurrentIndicatorExample
                menuDensity={menuDensity}
                selectionHoverColor="rgb(221, 85, 17)"
            />,
        );
        await page.evaluate(() => document.fonts.ready);
        await toggleAsideAndPause(page);
        await seekAnimations(page, 0.5);
        const participatingRow = page.locator(GROUP);
        const participatingSurface = participatingRow.locator(SURFACE);
        await participatingRow.hover();
        await page.evaluate(() =>
            document.getAnimations().forEach((animation) => animation.pause()),
        );
        await seekAnimations(page, 0.5);
        await expect(participatingSurface).toHaveAttribute('data-gn-aside-current-suppressed', '');
        expect(
            await participatingSurface.evaluate((element) =>
                getComputedStyle(element).getPropertyValue('--_--row-surface-color').trim(),
            ),
        ).toBe('transparent');
        await expect(participatingSurface).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        expect(await nativePaintDifference(page)).toBe(0);
        await finishAnimations(page);
        await page.mouse.move(1000, 800);
        const row = page.locator(GROUP);
        const surface = row.locator(SURFACE);
        await expect(surface).toHaveCSS('background-color', 'rgb(17, 85, 221)');
        expect(
            await row.evaluate((element) =>
                getComputedStyle(element).getPropertyValue('--_--row-surface-color').trim(),
            ),
        ).toBe('rgb(17, 85, 221)');
        await row.hover();
        await expect(surface).toHaveCSS('background-color', 'rgb(221, 85, 17)');
        expect(
            await row.evaluate((element) =>
                getComputedStyle(element).getPropertyValue('--_--row-surface-color').trim(),
            ),
        ).toBe('rgb(221, 85, 17)');
    });
}

for (const scenario of ['plain', 'collapsed-group', 'ambiguous'] as const) {
    test(`${scenario} keeps native highlighting without an extra transfer`, async ({
        mount,
        page,
    }) => {
        await page.setViewportSize({width: 1200, height: 900});
        await mount(
            <CurrentIndicatorExample
                mode={scenario === 'collapsed-group' ? 'group' : scenario}
                collapsedAnalytics={scenario === 'collapsed-group'}
                initialCurrentId={scenario === 'plain' ? 'home' : undefined}
            />,
        );
        await page.evaluate(() => document.fonts.ready);
        for (const progress of [0.5, 1]) {
            if (progress === 0.5) await toggleAsideAndPause(page);
            await seekAnimations(page, progress);
            await expect(page.locator(INDICATOR)).toHaveCount(0);
        }
        await finishAnimations(page);
        await expect(
            page.locator(
                `${scenario === 'plain' ? `${MENU} [data-gn-composite-bar-item-id="home"]` : GROUP} ${SURFACE}`,
            ),
        ).toHaveCSS('background-color', 'rgb(17, 85, 221)');
    });
}

for (const duplicate of [false, true]) {
    test(`quick access preserves section identity with main highlight ${duplicate}`, async ({
        mount,
        page,
    }) => {
        await page.setViewportSize({width: 1200, height: 900});
        await mount(
            <CurrentIndicatorExample
                enableQuickAccess
                pinCurrent
                quickAccessHighlightInMainMenu={duplicate}
            />,
        );
        await page.evaluate(() => document.fonts.ready);
        const quick = page.locator(
            `${QUICK} [data-gn-composite-bar-item-id="analytics-dashboards"] ${SURFACE}`,
        );
        await expect(quick).toHaveCSS('background-color', 'rgb(17, 85, 221)');
        await toggleAsideAndPause(page);
        await seekAnimations(page, 0.5);
        await expect(page.locator(INDICATOR)).toHaveCount(duplicate ? 1 : 0);
        await expect(quick).toHaveCSS('background-color', 'rgb(17, 85, 221)');
        await expect(quick).not.toHaveAttribute('data-gn-aside-current-suppressed', '');
        if (duplicate) {
            const moving = await box(page.locator(INDICATOR));
            const quickBox = await box(quick);
            expect(moving.y).toBeGreaterThan(quickBox.y + quickBox.height);
        }
        await finishAnimations(page);
        await expect(page.locator(`${GROUP} ${SURFACE}`)).toHaveCSS(
            'background-color',
            duplicate ? 'rgb(17, 85, 221)' : 'rgba(0, 0, 0, 0)',
        );
    });
}

test('transports an overflowing current item to More and back', async ({mount, page}, testInfo) => {
    await page.setViewportSize({width: 1200, height: 600});
    await mount(<CurrentIndicatorExample mode="more" />);
    await page.evaluate(() => document.fonts.ready);
    await page.locator(SCROLL).evaluate((element) => element.scrollTo(0, element.scrollHeight));
    const current = page.locator(`${MENU} [data-gn-composite-bar-item-id="more-26"] ${SURFACE}`);
    const source = await geometry(current);
    const sourceViewport = await box(page.locator(SCROLL));
    expect(source.y).toBeGreaterThanOrEqual(sourceViewport.y);
    expect(source.y + source.height).toBeLessThanOrEqual(sourceViewport.y + sourceViewport.height);
    await toggleAsideAndPause(page);
    await seekAnimations(page, 0.5);
    await expect(page.locator(INDICATOR)).toHaveCount(1);
    const representative = page.locator(`${MENU} [data-gn-aside-current-ids='["more-26"]']`);
    await expect(representative).not.toHaveAttribute('data-gn-composite-bar-item-id', 'more-26');
    await expect(representative).toHaveAttribute('aria-label', /More|Ещё|Еще/);
    await expectOnlyIndicatorPaint(page);
    await page.screenshot({
        path: testInfo.outputPath('more-midpoint.png'),
        animations: 'allow',
        scale: 'css',
    });
    await seekAnimations(page, 1);
    expectGeometryNear(
        await geometry(page.locator(INDICATOR)),
        await geometry(representative.locator(SURFACE)),
    );
    await finishAnimations(page);
    await toggleAsideAndPause(page);
    await seekAnimations(page, 0.5);
    await expect(page.locator(INDICATOR)).toHaveCount(1);
    await seekAnimations(page, 1);
    expectGeometryNear(await geometry(page.locator(INDICATOR)), await geometry(current));
    expect(source.height).toBe((await geometry(current)).height);
    await finishAnimations(page);
});

test('expanding indicator paints above decoration and below real text and icons', async ({
    mount,
    page,
}, testInfo) => {
    await page.setViewportSize({width: 1200, height: 900});
    await mount(
        <CurrentIndicatorExample
            initialCompact
            headerDecoration
            enableQuickAccess
            initialCurrentId="analytics-overview"
        />,
    );
    await page.evaluate(() => document.fonts.ready);
    const source = await geometry(page.locator(`${GROUP} ${SURFACE}`));
    const sourcePanelWidth = (await box(page.locator(PANEL))).width;
    await toggleAsideAndPause(page);
    await seekAnimations(page, 0.5);
    const midpointPanelWidth = (await box(page.locator(PANEL))).width;
    const targetPanelWidth = await page
        .locator(PANEL)
        .evaluate((element) => Number.parseFloat((element as HTMLElement).style.width));
    expect(midpointPanelWidth).toBeGreaterThan(sourcePanelWidth);
    expect(midpointPanelWidth).toBeLessThan(targetPanelWidth);
    await expect(page.locator(INDICATOR)).toHaveCount(1);
    await expectOnlyIndicatorPaint(page);
    const ink = await namedForegroundPaint(page);
    await testInfo.attach('named-foreground-ink-controls', {
        body: JSON.stringify(ink, null, 2),
        contentType: 'application/json',
    });
    for (const [index, named] of ['Overview text', 'Analytics icon'].entries()) {
        expect(ink.actual[index].inkPixels, named).toBeGreaterThan(2);
        expect(ink.actual[index].retainedInkPixels, named).toBe(ink.actual[index].inkPixels);
        expect(
            ink.aboveTextControl[index].retainedInkPixels,
            `${named} negative control`,
        ).toBeLessThan(ink.actual[index].inkPixels);
    }
    const icon = page.locator(`${GROUP} [data-gn-aside-part="icon"] svg.g-icon`);
    const iconBefore = await box(icon);
    await seekAnimations(page, 0.75);
    expect((await box(icon)).width).toBeCloseTo(iconBefore.width, 1);
    await seekAnimations(page, 0.5);
    await page.screenshot({
        path: testInfo.outputPath('decoration-below-text.png'),
        animations: 'allow',
        scale: 'css',
    });
    await seekAnimations(page, 1);
    const target = await geometry(
        page.locator(`${MENU} [data-gn-composite-bar-item-id="analytics-overview"] ${SURFACE}`),
    );
    const content = await box(page.locator('[class*="gn-aside-header__aside-content_"]'));
    for (const rect of [source, target]) {
        expect(rect.y).toBeGreaterThanOrEqual(content.y);
        expect(rect.y + rect.height).toBeLessThan(content.y + 660);
    }
    await finishAnimations(page);
});

test('native paint oracle rejects a half-alpha crossfade beside the indicator', async ({
    mount,
    page,
}, testInfo) => {
    await page.setViewportSize({width: 1200, height: 900});
    await mount(<CurrentIndicatorExample />);
    await page.evaluate(() => document.fonts.ready);
    await toggleAsideAndPause(page);
    await seekAnimations(page, 0.5);
    expect(await nativePaintDifference(page)).toBe(0);
    const native = page.locator(`${GROUP} ${SURFACE}`);
    const original = await native.getAttribute('style');
    try {
        await native.evaluate((element) =>
            (element as HTMLElement).style.setProperty(
                'background-color',
                'rgba(17, 85, 221, 0.5)',
                'important',
            ),
        );
        await expect(native).toHaveCSS('background-color', 'rgba(17, 85, 221, 0.5)');
        const changedPixels = await nativePaintDifference(page);
        expect(changedPixels).toBeGreaterThan(200);
        await testInfo.attach('half-alpha-native-negative-control', {
            body: JSON.stringify({changedPixels, injectedColor: 'rgba(17, 85, 221, 0.5)'}),
            contentType: 'application/json',
        });
    } finally {
        await native.evaluate((element, style) => {
            if (style === null) element.removeAttribute('style');
            else element.setAttribute('style', style);
        }, original);
    }
    expect(await nativePaintDifference(page)).toBe(0);
    await finishAnimations(page);
});

test('keeps the theme selection alpha during transfer', async ({mount, page}) => {
    await mount(<CurrentIndicatorExample selectionColor="rgba(17, 85, 221, 0.35)" />);
    await page.evaluate(() => document.fonts.ready);
    await toggleAsideAndPause(page);
    await seekAnimations(page, 0.5);
    await expect(page.locator(INDICATOR)).toHaveCSS('background-color', 'rgba(17, 85, 221, 0.35)');
    await expect(page.locator(INDICATOR)).toHaveCSS('opacity', '1');
    await finishAnimations(page);
});

for (const action of ['indicator-remount-target', 'indicator-unmount-aside']) {
    test(`${action} cleans indicator resources`, async ({mount, page}) => {
        await mount(<CurrentIndicatorExample />);
        await page.evaluate(() => document.fonts.ready);
        await toggleAsideAndPause(page);
        await seekAnimations(page, 0.5);
        await expect(page.locator(INDICATOR)).toHaveCount(1);
        await page.locator(`[data-qa="${action}"]`).evaluate((button) => button.click());
        await expect(page.locator(LAYER)).toHaveCount(0);
        await expect(page.locator('[data-gn-aside-current-suppressed]')).toHaveCount(0);
        await expect(page.locator('[data-gn-aside-transition-overlay]')).toHaveCount(0);
        if (action === 'indicator-remount-target') {
            await expect(page.locator(`${GROUP} ${SURFACE}`)).toHaveCSS(
                'background-color',
                'rgb(17, 85, 221)',
            );
        } else {
            await expect(page.locator(PANEL)).toHaveCount(0);
        }
    });
}

test('reduced motion uses immediate native current paint', async ({mount, page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await mount(<CurrentIndicatorExample />);
    await page.locator('button[title="Collapse"]').evaluate((button) => button.click());
    await expect(page.locator(LAYER)).toHaveCount(0);
    await expect(page.locator(`${GROUP} ${SURFACE}`)).toHaveCSS(
        'background-color',
        'rgb(17, 85, 221)',
    );
    expect(await page.locator(PANEL).evaluate((element) => element.getAnimations().length)).toBe(0);
});

test('replacing the target node with the same current metadata aborts only its transfer', async ({
    mount,
    page,
}) => {
    await mount(
        <CurrentIndicatorExample
            initialCompact
            initialCurrentId="analytics-overview"
            replaceableTarget
        />,
    );
    await page.evaluate(() => document.fonts.ready);
    await toggleAsideAndPause(page);
    await seekAnimations(page, 0.5);
    await expect(page.locator(INDICATOR)).toHaveCount(1);
    const current = page.locator(
        `${MENU} [data-gn-composite-bar-item-id="analytics-overview"] ${SURFACE}`,
    );
    const oldTarget = await current.elementHandle();
    await page.locator('[data-qa="indicator-replace-target"]').evaluate((button) => button.click());
    expect(await oldTarget?.evaluate((element) => element.isConnected)).toBe(false);
    await expect(page.locator(LAYER)).toHaveCount(0);
    await expect(current).toHaveCSS('background-color', 'rgb(17, 85, 221)');
    await expect(page.locator(PANEL)).toHaveAttribute('data-gn-aside-animating', '');
    expect(
        await page.locator(PANEL).evaluate((element) => element.getAnimations().length),
    ).toBeGreaterThan(0);
    await finishAnimations(page);
});

test('scrolling moves and clips the indicator without adding scrollable overflow', async ({
    mount,
    page,
}, testInfo) => {
    await page.setViewportSize({width: 1200, height: 420});
    await mount(<CurrentIndicatorExample initialCompact />);
    await page.evaluate(() => document.fonts.ready);
    const scroll = page.locator(SCROLL);
    await toggleAsideAndPause(page);
    for (const progress of [0.25, 0.5, 0.9]) {
        await seekAnimations(page, progress);
        await expect(page.locator(INDICATOR)).toHaveCount(1);
        await expectNoLayerOverflow(page);
    }
    await seekAnimations(page, 0.5);
    const before = await box(page.locator(INDICATOR));
    const scrollBefore = await scroll.evaluate((element) => element.scrollTop);
    const viewport = await box(scroll);
    await scroll.evaluate(
        (element, top) => element.scrollTo(0, top),
        scrollBefore + before.y + before.height / 2 - viewport.y,
    );
    const scrollAfter = await scroll.evaluate((element) => element.scrollTop);
    expect(scrollAfter - scrollBefore).toBeGreaterThan(0);
    const after = await box(page.locator(INDICATOR));
    expect(after.y - before.y).toBeCloseTo(scrollBefore - scrollAfter, 1);
    await expectClippedAtBoundary(page, 'header');
    await page.screenshot({
        path: testInfo.outputPath('header-crossing.png'),
        animations: 'allow',
        scale: 'css',
    });
    await scroll.evaluate((element) => element.scrollTo(0, 0));
    await seekAnimations(page, 0.9);
    const nearFooter = await box(page.locator(INDICATOR));
    await scroll.evaluate(
        (element, top) => element.scrollTo(0, Math.max(0, top)),
        nearFooter.y + nearFooter.height / 2 - viewport.y - viewport.height,
    );
    await expectClippedAtBoundary(page, 'footer');
    await page.screenshot({
        path: testInfo.outputPath('footer-crossing.png'),
        animations: 'allow',
        scale: 'css',
    });
    await finishAnimations(page);
});

test('bounds the layer when the moving source extends below shortened menu content', async ({
    mount,
    page,
}, testInfo) => {
    await page.setViewportSize({width: 1200, height: 360});
    await mount(<CurrentIndicatorExample mode="short-group" />);
    await page.evaluate(() => document.fonts.ready);
    const scroll = page.locator(SCROLL);
    const viewport = await box(scroll);
    const child = await box(page.locator(`${CHILD} ${SURFACE}`));
    await scroll.evaluate(
        (element, top) => element.scrollTo(0, Math.max(0, top)),
        child.y + child.height / 2 - viewport.y - viewport.height,
    );
    const source = await box(page.locator(`${CHILD} ${SURFACE}`));
    expect(source.y).toBeLessThan(viewport.y + viewport.height - 2);
    expect(source.y + source.height).toBeGreaterThan(viewport.y + viewport.height + 2);
    const oldContent = await box(page.locator(`${SCROLL} > [data-gn-aside-current-container]`));
    await toggleAsideAndPause(page);
    await seekAnimations(page, 0);
    const moving = await box(page.locator(INDICATOR));
    const layer = await box(page.locator(LAYER));
    expect(moving.y).toBeLessThan(layer.y + layer.height - 2);
    expect(moving.y + moving.height).toBeGreaterThan(layer.y + layer.height + 2);
    // Other animating native rows may retain old scrollable overflow; the actual
    // bounded content frame has shortened independently of that transient paint.
    expect(layer.height).toBeLessThan(oldContent.height);
    await expectNoLayerOverflow(page);
    const overflowControl = await scroll.evaluate((element) => {
        const layerElement = element.querySelector<HTMLElement>(
            '[data-gn-aside-current-indicator-layer]',
        );
        if (!layerElement) throw new Error('Indicator layer missing');
        const original = layerElement.getAttribute('style');
        try {
            const clippedHeight = element.scrollHeight;
            layerElement.style.overflow = 'visible';
            const unclippedHeight = element.scrollHeight;
            layerElement.style.display = 'none';
            const withoutLayerHeight = element.scrollHeight;
            return {clippedHeight, unclippedHeight, withoutLayerHeight};
        } finally {
            if (original === null) layerElement.removeAttribute('style');
            else layerElement.setAttribute('style', original);
        }
    });
    expect(overflowControl.clippedHeight).toBe(overflowControl.withoutLayerHeight);
    expect(overflowControl.unclippedHeight).toBeGreaterThan(overflowControl.clippedHeight);
    await testInfo.attach('layer-overflow-negative-control', {
        body: JSON.stringify(overflowControl),
        contentType: 'application/json',
    });
    await expectClippedAtBoundary(page, 'footer');
    await page.screenshot({
        path: testInfo.outputPath('short-content-crossing.png'),
        animations: 'allow',
        scale: 'css',
    });
    await finishAnimations(page);
});

test('restores a newly selected existing row before layout motion finishes', async ({
    mount,
    page,
}) => {
    await page.setViewportSize({width: 1200, height: 900});
    await mount(<CurrentIndicatorExample />);
    await page.evaluate(() => document.fonts.ready);
    await toggleAsideAndPause(page);
    await seekAnimations(page, 0.5);
    await expect(page.locator(INDICATOR)).toHaveCount(1);
    const ghost = page.locator('[data-gn-aside-transition-overlay] .g-list').filter({
        has: page.locator('[aria-label="Weekly operational performance"]'),
    });
    const ghostNode = await ghost.elementHandle();
    const clipBefore = await ghost.evaluate((element) => getComputedStyle(element).clipPath);
    const panelBefore = await box(page.locator(PANEL));
    const followingGroup = page.locator(
        `${MENU} [data-gn-composite-bar-item-id="__gn-composite-bar__group-header__monitoring"]`,
    );
    const followingGroupBefore = await box(followingGroup);
    await page
        .locator('[data-qa="indicator-change-top-level-current"]')
        .evaluate((button) => button.click());
    await expect(page.locator(INDICATOR)).toHaveCount(0);
    await expect(
        page.locator(`${MENU} [data-gn-composite-bar-item-id="home"] ${SURFACE}`),
    ).toHaveCSS('background-color', 'rgb(17, 85, 221)');
    await expect(page.locator('[data-gn-aside-transition-overlay]')).toHaveCount(1);
    await expect(page.locator('[data-gn-aside-panel]')).toHaveAttribute(
        'data-gn-aside-animating',
        '',
    );
    expect(
        await page
            .locator('[data-gn-aside-transition-overlay]')
            .evaluate((element) => element.getAnimations({subtree: true}).length),
    ).toBeGreaterThan(0);
    expect(
        await page
            .locator('[data-gn-aside-panel]')
            .evaluate((element) => element.getAnimations().length),
    ).toBeGreaterThan(0);
    await expect(page.locator('[data-gn-aside-current-suppressed]')).toHaveCount(0);
    expect(await ghostNode?.evaluate((element) => element.isConnected)).toBe(true);
    expect(await ghost.evaluate((element) => getComputedStyle(element).clipPath)).toBe(clipBefore);
    expect(await ghost.evaluate((element) => element.getAnimations().length)).toBeGreaterThan(0);
    await seekAnimations(page, 0.75);
    expect(await ghost.evaluate((element) => getComputedStyle(element).clipPath)).not.toBe(
        clipBefore,
    );
    expect((await box(page.locator(PANEL))).width).not.toBe(panelBefore.width);
    expect((await box(followingGroup)).y).not.toBe(followingGroupBefore.y);
    await finishAnimations(page);
});

test('transports one solid selection from Weekly to Analytics at the midpoint', async ({
    mount,
    page,
}, testInfo) => {
    await page.setViewportSize({width: 1200, height: 900});
    await mount(<AsideHeaderExamplesStories.FullNavigation />);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
        content: '.g-root { --gn-aside-header-item-current-background-color: rgb(17, 85, 221); }',
    });
    await page.locator(CHILD).click();
    await page.mouse.move(1000, 800);
    await expect(page.locator(`${CHILD} ${SURFACE}`)).toHaveCSS(
        'background-color',
        'rgb(17, 85, 221)',
    );
    const source = await page.locator(`${CHILD} ${SURFACE}`).boundingBox();
    if (!source) throw new Error('Weekly selection missing');

    await toggleAsideAndPause(page);
    await seekAnimations(page, 0.5);
    // This is intentionally a midpoint regression: the base already keeps
    // Analytics transparent at 0%, then crossfades it against the clipped child.
    await expect(page.locator(INDICATOR)).toHaveCount(1);
    const indicator = page.locator(INDICATOR);
    const middle = await indicator.boundingBox();
    if (!middle) throw new Error('Moving selection missing');
    await expect(indicator).toHaveCSS('opacity', '1');
    await expect(indicator).toHaveCSS('background-color', 'rgb(17, 85, 221)');
    await expect(page.locator(`${GROUP} ${SURFACE}`)).toHaveCSS(
        'background-color',
        'rgba(0, 0, 0, 0)',
    );
    await expect(
        page.locator(
            '[data-gn-aside-transition-overlay] [aria-label="Weekly operational performance"] ' +
                SURFACE,
        ),
    ).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

    const panel = await page.locator('[data-gn-aside-panel]').boundingBox();
    const scroll = await page.locator('[data-gn-aside-scrollport]').boundingBox();
    if (!panel || !scroll) throw new Error('Selection clipping frame missing');
    const paint = await selectionPaint(page, {
        x: panel.x,
        y: scroll.y,
        width: panel.width,
        height: scroll.height,
    });
    expect(paint.selectionPixels).toBeGreaterThan(200);
    if (!paint.bounds) throw new Error('Indicator is not painted');
    expect(Math.abs(paint.bounds.x - middle.x)).toBeLessThanOrEqual(2);
    expect(Math.abs(paint.bounds.y - middle.y)).toBeLessThanOrEqual(2);
    expect(Math.abs(paint.bounds.height - middle.height)).toBeLessThanOrEqual(2);
    const visibleRight = Math.min(middle.x + middle.width, panel.x + panel.width);
    expect(Math.abs(paint.bounds.x + paint.bounds.width - visibleRight)).toBeLessThanOrEqual(2);
    await page.screenshot({
        path: testInfo.outputPath('weekly-to-analytics-midpoint.png'),
        animations: 'allow',
        scale: 'css',
    });

    await seekAnimations(page, 1);
    const destination = await page.locator(`${GROUP} ${SURFACE}`).boundingBox();
    if (!destination) throw new Error('Analytics selection missing');
    expect(middle.y).toBeGreaterThan(destination.y);
    expect(middle.y).toBeLessThan(source.y);
    expect(middle.width).toBeGreaterThan(destination.width);
    expect(middle.width).toBeLessThan(source.width);
    expect(middle.height).toBeGreaterThan(destination.height);
    expect(middle.height).toBeLessThan(source.height);
    const end = await indicator.boundingBox();
    expect(end).toEqual(destination);
    await finishAnimations(page);
    await expect(indicator).toHaveCount(0);
    await expect(page.locator(`${GROUP} ${SURFACE}`)).toHaveCSS(
        'background-color',
        'rgb(17, 85, 221)',
    );
    expect(await page.locator(`${GROUP} ${SURFACE}`).boundingBox()).toEqual(destination);
});
