/* Playwright queries are page-scoped, not Testing Library render queries. */
/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';

import {ActionBarStories} from './helpersPlaywright';

test.describe('ActionBar', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<ActionBarStories.Showcase />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <SingleSection>', async ({mount, expectScreenshot}) => {
        await mount(<ActionBarStories.SingleSection />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <StretchGroup>', async ({mount, expectScreenshot}) => {
        await mount(<ActionBarStories.StretchGroup />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('collapses breadcrumbs when narrowed and restores them when widened', async ({
        mount,
        page,
    }) => {
        await page.setViewportSize({width: 1200, height: 720});
        // No fixed width: the bar has to follow the viewport.
        await mount(<ActionBarStories.Showcase />, undefined, {padding: 20});

        const bar = page.getByRole('region', {name: 'Actions bar'});
        const breadcrumbs = bar.locator('.g-breadcrumbs');
        const showMore = breadcrumbs.getByRole('button');
        const rightGroup = bar.getByRole('group').last();
        const rightGroupOverflow = async () => {
            const [barBox, groupBox] = await Promise.all([
                bar.boundingBox(),
                rightGroup.boundingBox(),
            ]);
            if (!barBox || !groupBox) throw new Error('Missing action bar geometry');
            return groupBox.x + groupBox.width - (barBox.x + barBox.width);
        };
        const expectExpanded = async () => {
            await expect(breadcrumbs.getByRole('link')).toHaveText([
                'Projects',
                '@gravity-ui',
                'navigation',
            ]);
            await expect(showMore).toHaveCount(0);
        };

        await expectExpanded();

        // At 480px the collapsed breadcrumbs fit; narrower, they would overlap the right group.
        await page.setViewportSize({width: 480, height: 720});
        await expect.poll(rightGroupOverflow).toBeLessThanOrEqual(0.5);
        await expect(showMore).toBeVisible();

        await page.setViewportSize({width: 1200, height: 720});
        await expectExpanded();
    });
});
