import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';

import {AsideHeaderStories} from './helpersPlaywright';

test('resizes the fallback separator with its panel in both directions', async ({mount, page}) => {
    await mount(<AsideHeaderStories.Fallback headerDecoration={false} />);
    const panel = page.locator('[data-qa="pl-aside-fallback"]');
    for (const _direction of ['collapse', 'expand']) {
        await page.locator('button', {hasText: 'Toggle compact'}).evaluate(async (element) => {
            element.click();
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            document.getAnimations().forEach((animation) => animation.pause());
        });
        for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
            await page.evaluate((fraction) => {
                document.getAnimations().forEach((animation) => {
                    // eslint-disable-next-line no-param-reassign
                    animation.currentTime =
                        Number(animation.effect?.getComputedTiming().duration) * fraction;
                });
            }, progress);
            const widths = await panel.evaluate((element) => {
                const divider = element.querySelector('[data-gn-aside-divider="header"]');
                if (!divider) throw new Error('Fallback divider missing');
                return [
                    element.getBoundingClientRect().width,
                    divider.getBoundingClientRect().width,
                ];
            });
            expect(widths[1]).toBeCloseTo(widths[0], 1);
        }
        await page.evaluate(async () => {
            const animations = document.getAnimations();
            animations.forEach((animation) => animation.finish());
            await Promise.all(
                animations.map((animation) => animation.finished.catch(() => undefined)),
            );
        });
    }
});
