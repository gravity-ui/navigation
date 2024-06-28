import React from 'react';

import {test} from '~playwright/core';

import {FooterStories} from './helpersPlaywright';

test.describe('Footer', () => {
    test('render story: <ClearView>', async ({mount, expectScreenshot, defaultDelay}) => {
        await mount(<FooterStories.ClearView />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await defaultDelay();

        await expectScreenshot();
    });

    test('render story: <ManyItems>', async ({mount, expectScreenshot, defaultDelay}) => {
        await mount(<FooterStories.ManyItems />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await defaultDelay();

        await expectScreenshot();
    });

    test('render story: <Showcase>', async ({mount, expectScreenshot, defaultDelay}) => {
        await mount(<FooterStories.Showcase />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await defaultDelay();

        await expectScreenshot();
    });
});
