import {expect} from '@playwright/experimental-ct-react';

import type {ExpectScreenshotFixture, PlaywrightFixture} from './types';

export const expectScreenshotFixture: PlaywrightFixture<ExpectScreenshotFixture> = async (
    {page},
    use,
    testInfo,
) => {
    const expectScreenshot: ExpectScreenshotFixture = async ({
        component,
        screenshotName,
        ...pageScreenshotOptions
    } = {}) => {
        const target = component || page.locator('.playwright-wrapper-test');
        const nameScreenshot = testInfo.titlePath.slice(1).join(' ');
        const options = {
            animations: 'disabled' as const,
            scale: 'device' as const,
            threshold: 0.1,
            ...pageScreenshotOptions,
        };

        // Wait for stable frames after layout, font and theme updates.
        await expect(target).toHaveScreenshot(
            `${screenshotName || nameScreenshot} light.png`,
            options,
        );

        await page.emulateMedia({colorScheme: 'dark'});

        await expect(target).toHaveScreenshot(
            `${screenshotName || nameScreenshot} dark.png`,
            options,
        );
    };

    await use(expectScreenshot);
};
