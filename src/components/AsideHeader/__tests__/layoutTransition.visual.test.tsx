import React from 'react';

import {expect} from '@playwright/experimental-ct-react';
import type {Page} from '@playwright/test';

import {test} from '~playwright/core';

import {AsideTransitionExample} from '../__playwright__/AsideTransitionExample';
import {
    finishAnimations as finish,
    seekAnimations as seek,
    toggleAsideAndPause as toggleAndPause,
} from '../__playwright__/transitionTestUtils';

import {AsideHeaderExamplesStories, AsideHeaderStories} from './helpersPlaywright';

test('resizes nested dividers while a group departs and reverses', async ({mount, page}) => {
    await mount(<AsideTransitionExample initialCompact={false} withGroupedDivider />);
    await page.evaluate(() => document.fonts.ready);
    const geometry = () =>
        page.evaluate(() => {
            const divider = document.querySelector('[data-gn-aside-divider="item/nested"]');
            const item = document.querySelector('[aria-label="Grouped item"]');
            const panel = document.querySelector('[data-gn-aside-panel]');
            if (!divider || !item || !panel) throw new Error('Group geometry missing');
            const rect = divider.getBoundingClientRect();
            return {
                width: rect.width,
                panelWidth: panel.getBoundingClientRect().width,
                gap: rect.y - item.getBoundingClientRect().bottom,
            };
        });
    const before = await geometry();
    await toggleAndPause(page);
    for (const progress of [0, 0.25, 0.5]) {
        await seek(page, progress);
        const current = await geometry();
        expect(current.width).toBeCloseTo(before.width + current.panelWidth - before.panelWidth, 1);
        expect(current.gap).toBeCloseTo(before.gap, 1);
    }
    const middle = await geometry();
    await toggleAndPause(page);
    await seek(page, 0);
    expect((await geometry()).width).toBeCloseTo(middle.width, 1);
    for (const progress of [0.25, 0.5, 1]) {
        await seek(page, progress);
        const current = await geometry();
        expect(current.width).toBeCloseTo(before.width + current.panelWidth - before.panelWidth, 1);
        expect(current.gap).toBeCloseTo(before.gap, 1);
    }
    const end = await geometry();
    await finish(page);
    expect(await geometry()).toEqual(end);
});

for (const menuDensity of ['default', 'compact'] as const) {
    test(`preserves two-line and action icon geometry in ${menuDensity} density`, async ({
        mount,
        page,
    }) => {
        await mount(<AsideTransitionExample menuDensity={menuDensity} />);
        await page.evaluate(() => document.fonts.ready);
        const icons = () =>
            page.evaluate(() =>
                ['long', 'action'].map((id) => {
                    const icon = document.querySelector(
                        `[data-gn-composite-bar-item-id="${id}"] [data-gn-aside-part="icon"] svg`,
                    );
                    if (!icon) throw new Error('Icon missing');
                    const rect = icon.getBoundingClientRect();
                    return {x: rect.x, y: rect.y, width: rect.width, height: rect.height};
                }),
            );
        const before = await icons();
        await toggleAndPause(page);
        await seek(page, 0);
        const start = await icons();
        for (let i = 0; i < before.length; i++) {
            expect(start[i].x).toBeCloseTo(before[i].x, 1);
            expect(start[i].y).toBeCloseTo(before[i].y, 1);
        }
        await seek(page, 0.5);
        const middle = await icons();
        for (let i = 0; i < before.length; i++) {
            expect(middle[i].width).toBe(before[i].width);
            expect(middle[i].height).toBe(before[i].height);
        }
        await seek(page, 1);
        const end = await icons();
        await finish(page);
        expect(await icons()).toEqual(end);
        await expect(page.locator('[data-gn-aside-panel]')).toHaveCSS(
            'width',
            menuDensity === 'default' ? '236px' : '220px',
        );
    });
}

test('animates equal divider ids independently across header, menu and footer', async ({
    mount,
    page,
}) => {
    await mount(<AsideTransitionExample initialCompact={false} withDividers />);
    const lines = page.locator('[data-gn-aside-divider="item/shared"]');
    await expect(lines).toHaveCount(3);
    const widths = () =>
        lines.evaluateAll((elements) =>
            elements.map((element) => element.getBoundingClientRect().width),
        );
    const before = await widths();
    await toggleAndPause(page);
    await seek(page, 0);
    (await widths()).forEach((width, index) => expect(width).toBeCloseTo(before[index], 1));
    await seek(page, 0.5);
    (await widths()).forEach((width, index) => expect(width).toBeLessThan(before[index] - 20));
    await seek(page, 1);
    const end = await widths();
    await finish(page);
    expect(await widths()).toEqual(end);
});

for (const menuDensity of ['default', 'compact'] as const) {
    for (const initialCompact of [false, true]) {
        test(`resizes both Showcase menu dividers (${menuDensity}, compact=${initialCompact})`, async ({
            mount,
            page,
        }) => {
            await mount(<AsideHeaderStories.Showcase {...{menuDensity, initialCompact}} />);
            await page.evaluate(() => document.fonts.ready);
            await expect(page.locator('[class*="__menu-divider_"]')).toHaveCount(2);
            const geometry = () =>
                page.evaluate(() => {
                    const panel = document.querySelector('[data-gn-aside-panel]');
                    if (!panel) throw new Error('Panel missing');
                    const panelRect = panel.getBoundingClientRect();
                    return Array.from(
                        panel.querySelectorAll('[class*="__menu-divider_"]'),
                        (line) => {
                            const rect = line.getBoundingClientRect();
                            return {
                                width: rect.width,
                                left: rect.left - panelRect.left,
                                right: panelRect.right - rect.right,
                            };
                        },
                    );
                });
            const before = await geometry();
            await toggleAndPause(page);
            for (const progress of [0, 0.25, 0.5]) {
                await seek(page, progress);
                (await geometry()).forEach((line, index) => {
                    expect(line.left).toBeCloseTo(before[index].left, 1);
                    expect(line.right).toBeCloseTo(before[index].right, 1);
                });
            }
            const middle = await geometry();
            expect(Math.abs(middle[0].width - before[0].width)).toBeGreaterThan(20);
            await toggleAndPause(page);
            await seek(page, 0);
            (await geometry()).forEach((line, index) => {
                expect(line.width).toBeCloseTo(middle[index].width, 1);
            });
            for (const progress of [0.25, 0.5, 0.75, 1]) {
                await seek(page, progress);
                (await geometry()).forEach((line, index) => {
                    expect(line.left).toBeCloseTo(before[index].left, 1);
                    expect(line.right).toBeCloseTo(before[index].right, 1);
                });
            }
            const end = await geometry();
            await finish(page);
            expect(await geometry()).toEqual(end);
        });
    }
}

for (const menuDensity of ['default', 'compact'] as const) {
    for (const initialCompact of [true, false]) {
        test(`keeps section dividers aligned during transitions (${menuDensity}, compact=${initialCompact})`, async ({
            mount,
            page,
        }) => {
            await mount(
                <AsideHeaderExamplesStories.FullNavigation
                    initialCompact={initialCompact}
                    menuDensity={menuDensity}
                    enableQuickAccess
                />,
            );
            await page.evaluate(() => document.fonts.ready);
            const positions = () =>
                page.evaluate(() => {
                    const overview = document.querySelector(
                        '[id="gravity-ui/navigation-quick-access-composite-bar"] [data-gn-composite-bar-item-id="analytics-overview"]',
                    );
                    const divider = document.querySelector(
                        '[data-gn-aside-divider="quick-access"]',
                    );
                    const panel = document.querySelector('[data-gn-aside-panel]');
                    if (!overview || !divider || !panel)
                        throw new Error('Quick-access geometry missing');
                    const itemRect = overview.getBoundingClientRect();
                    const dividerRect = divider.getBoundingClientRect();
                    const panelRect = panel.getBoundingClientRect();
                    return {
                        y: dividerRect.y,
                        width: dividerRect.width,
                        gap: dividerRect.y - itemRect.bottom,
                        leftGap: dividerRect.left - panelRect.left,
                        rightGap: panelRect.right - dividerRect.right,
                        sectionDividers: Array.from(
                            panel.querySelectorAll('[data-gn-aside-divider]'),
                            (line) => {
                                const rect = line.getBoundingClientRect();
                                return {
                                    id: line.getAttribute('data-gn-aside-divider'),
                                    width: rect.width,
                                    leftGap: rect.left - panelRect.left,
                                    rightGap: panelRect.right - rect.right,
                                };
                            },
                        ),
                    };
                });
            const before = await positions();
            expect(before.sectionDividers.map(({id}) => id)).toEqual([
                'header',
                'quick-access',
                'footer',
                'collapse',
            ]);
            await toggleAndPause(page);
            for (const progress of [0, 0.25, 0.5]) {
                await seek(page, progress);
                const current = await positions();
                expect(current.gap).toBeCloseTo(before.gap, 1);
                expect(current.leftGap).toBeCloseTo(before.leftGap, 1);
                expect(current.rightGap).toBeCloseTo(before.rightGap, 1);
                current.sectionDividers.forEach((line, index) => {
                    expect(line.leftGap).toBeCloseTo(before.sectionDividers[index].leftGap, 1);
                    expect(line.rightGap).toBeCloseTo(before.sectionDividers[index].rightGap, 1);
                });
            }
            const middle = await positions();
            expect(Math.abs(middle.y - before.y)).toBeGreaterThan(5);

            // Reverse mid-flight: the divider must retain the same offset and
            // current position, just like the row it follows.
            await toggleAndPause(page);
            await seek(page, 0);
            expect((await positions()).y).toBeCloseTo(middle.y, 1);
            expect((await positions()).width).toBeCloseTo(middle.width, 1);
            (await positions()).sectionDividers.forEach((line, index) => {
                expect(line.width).toBeCloseTo(middle.sectionDividers[index].width, 1);
            });
            for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
                await seek(page, progress);
                const current = await positions();
                expect(current.gap).toBeCloseTo(before.gap, 1);
                expect(current.leftGap).toBeCloseTo(before.leftGap, 1);
                expect(current.rightGap).toBeCloseTo(before.rightGap, 1);
                current.sectionDividers.forEach((line, index) => {
                    expect(line.leftGap).toBeCloseTo(before.sectionDividers[index].leftGap, 1);
                    expect(line.rightGap).toBeCloseTo(before.sectionDividers[index].rightGap, 1);
                });
            }
            const end = await positions();
            await finish(page);
            expect((await positions()).y).toBeCloseTo(end.y, 1);
            expect((await positions()).width).toBeCloseTo(end.width, 1);
            expect((await positions()).gap).toBeCloseTo(before.gap, 1);
            (await positions()).sectionDividers.forEach((line, index) => {
                expect(line.width).toBeCloseTo(end.sectionDividers[index].width, 1);
            });
        });
    }
}

async function menuGeometry(page: Page) {
    return page.evaluate(() => {
        const panel = document.querySelector<HTMLElement>('[data-gn-aside-panel]');
        const menu = document.querySelector(
            '[id="gravity-ui/navigation-menu-items-composite-bar"]',
        );
        const row = menu?.querySelector('button[aria-label="Monitoring"]');
        const title = row?.querySelector<HTMLElement>('[data-gn-aside-part="title"]');
        const icon = row?.querySelector('[data-gn-aside-part="icon"] svg');
        if (!panel || !row || !title || !icon) throw new Error('Menu geometry missing');
        const iconRect = icon.getBoundingClientRect();
        return {
            width: panel.getBoundingClientRect().width,
            y: row.getBoundingClientRect().y,
            iconX: iconRect.x + iconRect.width / 2,
            titleWidth: title.getBoundingClientRect().width,
            titleOpacity: Number(getComputedStyle(title).opacity),
            ghosts: panel.querySelectorAll('[data-gn-aside-transition-overlay]').length,
        };
    });
}

test('reveals titles and moves rows before expansion ends', async ({mount, page}) => {
    await mount(
        <AsideHeaderExamplesStories.FullNavigation initialCompact enableQuickAccess={false} />,
    );
    await page.evaluate(() => document.fonts.ready);
    const before = await menuGeometry(page);
    await toggleAndPause(page);
    await seek(page, 0.5);
    const middle = await menuGeometry(page);
    expect(middle.width).toBeGreaterThan(60);
    expect(middle.width).toBeLessThan(200);
    expect(middle.titleWidth).toBeGreaterThan(30);
    expect(middle.titleOpacity).toBeGreaterThan(0.1);
    expect(middle.y).toBeGreaterThan(before.y + 10);
    expect(middle.y).toBeLessThan(340);
    expect(middle.iconX).toBeCloseTo(before.iconX, 1);
    await seek(page, 1);
    const end = await menuGeometry(page);
    await finish(page);
    const settled = await menuGeometry(page);
    expect(settled.width).toBe(220);
    expect(settled.y).toBeCloseTo(end.y, 1);
    expect(settled.ghosts).toBe(0);
});

for (const reverse of [false, true]) {
    test(`collapses continuously and cleans up (reverse=${reverse})`, async ({mount, page}) => {
        await mount(<AsideHeaderExamplesStories.FullNavigation enableQuickAccess={false} />);
        await page.evaluate(() => document.fonts.ready);
        const before = await menuGeometry(page);
        await toggleAndPause(page);
        await seek(page, 0.5);
        const middle = await menuGeometry(page);
        expect(middle.y).toBeLessThan(before.y - 10);
        expect(middle.y).toBeGreaterThan(215);
        expect(middle.iconX).toBeCloseTo(before.iconX, 1);
        if (reverse) {
            await toggleAndPause(page);
            await seek(page, 0);
            const reversed = await menuGeometry(page);
            expect(reversed.y).toBeCloseTo(middle.y, 1);
            await seek(page, 0.5);
            expect((await menuGeometry(page)).y).toBeGreaterThan(middle.y);
        }
        await finish(page);
        const end = await menuGeometry(page);
        expect(end.width).toBe(reverse ? 220 : 44);
        expect(end.ghosts).toBe(0);
    });
}

test('finishes immediately with reduced motion', async ({mount, page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await mount(
        <AsideHeaderExamplesStories.FullNavigation initialCompact enableQuickAccess={false} />,
    );
    await page.locator('button[title="Expand"]').click();
    const panel = page.locator('[data-gn-aside-panel]');
    await expect(panel).toHaveCSS('width', '220px');
    expect(await panel.evaluate((element) => element.getAnimations({subtree: true}).length)).toBe(
        0,
    );
    await expect(page.locator('[data-gn-aside-transition-overlay]')).toHaveCount(0);
});

test('keeps departing groups inside the scrolled menu viewport', async ({mount, page}) => {
    await page.setViewportSize({width: 1200, height: 400});
    await mount(<AsideHeaderExamplesStories.FullNavigation enableQuickAccess={false} />);
    await page.evaluate(() => document.fonts.ready);
    const viewport = page.locator('[data-gn-aside-scrollport]');
    await viewport.evaluate((element) => {
        element.scrollTo(0, 100);
    });
    const before = await viewport.boundingBox();
    if (!before) throw new Error('Scroll viewport missing');
    await toggleAndPause(page);
    await seek(page, 0.5);
    const clip = page.locator('[data-gn-aside-transition-scroll-clip]');
    await expect(clip).toHaveCSS('overflow', 'hidden');
    const during = await clip.boundingBox();
    if (!during) throw new Error('Ghost clipping region missing');
    expect(during.y).toBeGreaterThanOrEqual(before.y);
    expect(during.y + during.height).toBeLessThanOrEqual(before.y + before.height + 0.5);
    await finish(page);
    await expect(clip).toHaveCount(0);
});

test('morphs the selected surface without scaling the icon', async ({mount, page}, testInfo) => {
    await mount(<AsideHeaderExamplesStories.FullNavigation initialCompact />);
    await page.evaluate(() => document.fonts.ready);
    const measureSelection = () =>
        page.evaluate(() => {
            const row = document.querySelector(
                '[id="gravity-ui/navigation-quick-access-composite-bar"] button[aria-label="Overview"]',
            );
            const icon = row?.querySelector('[data-gn-aside-part="icon"] svg');
            const surface = row?.querySelector('[data-gn-aside-part="surface"]');
            if (!icon || !surface) throw new Error('Selected row missing');
            const iconRect = icon.getBoundingClientRect();
            const surfaceRect = surface.getBoundingClientRect();
            return {
                surfaceWidth: surfaceRect.width,
                surfaceHit: row?.contains(
                    document.elementFromPoint(
                        surfaceRect.x + surfaceRect.width / 2,
                        surfaceRect.y + 3,
                    ),
                ),
                iconX: iconRect.x + iconRect.width / 2,
                iconWidth: iconRect.width,
            };
        });
    const before = await measureSelection();
    await toggleAndPause(page);
    await seek(page, 0.5);
    const middle = await measureSelection();
    expect(middle.surfaceWidth).toBeGreaterThan(before.surfaceWidth + 10);
    expect(middle.surfaceWidth).toBeLessThan(200);
    expect(middle.iconX).toBeCloseTo(before.iconX, 1);
    expect(middle.iconWidth).toBe(before.iconWidth);
    expect(middle.surfaceHit).toBe(true);
    await page.screenshot({
        path: testInfo.outputPath('selection-midpoint.png'),
        animations: 'allow',
    });
    await finish(page);
});

test('keeps the collapsing selection painted and preserves themed title ghosts', async ({
    mount,
    page,
}, testInfo) => {
    await mount(<AsideHeaderExamplesStories.FullNavigation />);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
        content: '.g-root { --gn-aside-header-item-current-text-color: rgb(155, 0, 0); }',
    });
    await toggleAndPause(page);
    await seek(page, 0.5);
    const result = await page.evaluate(() => {
        const row = document.querySelector(
            '[id="gravity-ui/navigation-quick-access-composite-bar"] button[aria-label="Overview"]',
        );
        const surface = row?.querySelector('[data-gn-aside-part="surface"]');
        const ghost = Array.from(
            document.querySelectorAll(
                '[data-gn-aside-transition-overlay] [data-gn-aside-part="title"]',
            ),
        ).find((element) => element.textContent === 'Overview');
        if (!row || !surface || !ghost) throw new Error('Animated selection missing');
        const rect = surface.getBoundingClientRect();
        return {
            width: rect.width,
            hit: (() => {
                // The surface extends beyond the compact button and normally
                // ignores pointers. Enable hit-testing only to detect clipping.
                const element = surface as HTMLElement;
                element.style.pointerEvents = 'auto';
                const hit =
                    document.elementFromPoint(rect.x + rect.width / 2, rect.y + 3) === element;
                element.style.removeProperty('pointer-events');
                return hit;
            })(),
            color: getComputedStyle(ghost.firstElementChild ?? ghost).color,
        };
    });
    expect(result.width).toBeGreaterThan(60);
    expect(result.hit).toBe(true);
    expect(result.color).toBe('rgb(155, 0, 0)');
    await page.screenshot({
        path: testInfo.outputPath('collapse-midpoint.png'),
        animations: 'allow',
    });
    await finish(page);
    await expect(page.locator('[data-gn-aside-transition-overlay]')).toHaveCount(0);
});
