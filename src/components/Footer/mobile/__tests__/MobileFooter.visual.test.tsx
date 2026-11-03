import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';

import {MobileFooter} from '../Footer';

import {MobileFooterStories} from './helpersPlaywright';

test.describe('MobileFooter', () => {
    test('render story: <ClearView>', async ({mount, expectScreenshot, defaultDelay}) => {
        await mount(
            <MobileFooter copyright={`@ ${new Date().getFullYear()} "My Service"`} view="clear" />,
        );

        await defaultDelay();

        await expectScreenshot();
    });

    test('render story: <ManyItems>', async ({mount, expectScreenshot, defaultDelay}) => {
        await mount(<MobileFooterStories.ManyItems />, undefined, {
            padding: 20,
            width: 390,
            height: 844,
        });

        await defaultDelay();

        await expectScreenshot();
    });

    test('render story: <Showcase>', async ({mount, expectScreenshot, defaultDelay}) => {
        await mount(<MobileFooterStories.Showcase />, undefined, {
            padding: 20,
            width: 390,
            height: 844,
        });

        await defaultDelay();

        await expectScreenshot();
    });

    test('closes the more items sheet on Escape and opens it again', async ({mount, page}) => {
        await mount(<MobileFooterStories.ManyItems />, undefined, {
            padding: 20,
            width: 390,
            height: 844,
        });

        const moreButton = page.locator('button[title="Show more"]');
        const sheet = page.locator('[role="dialog"]');

        await moreButton.click();
        await expect(sheet).toBeVisible();

        await page.keyboard.press('Escape');
        await expect(sheet).toBeHidden();

        await moreButton.click();
        await expect(sheet).toBeVisible();
    });
});
