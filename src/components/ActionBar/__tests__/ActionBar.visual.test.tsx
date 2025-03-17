import React from 'react';

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
});
