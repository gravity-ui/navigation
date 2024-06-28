import React from 'react';

import {test} from '~playwright/core';

import {MobileFooterStories} from './helpersPlaywright';

test.describe('MobileFooter', () => {
    test('render story: <ClearView>', async ({mount, expectScreenshot, defaultDelay}) => {
        await mount(<MobileFooterStories.ClearView />, undefined, {
            padding: 20,
            width: 390,
            height: 844,
        });

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
});
