import React from 'react';

import {test} from '~playwright/core';

import {ActionBarStories} from './helpersPlaywright';

test.describe('ActionBar', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<ActionBarStories.Showcase />, undefined, {
            padding: 20,
            width: 390,
            height: 844,
        });

        await expectScreenshot();
    });

    test('render story: <SingleSection>', async ({mount, expectScreenshot}) => {
        await mount(<ActionBarStories.SingleSection />, undefined, {
            padding: 20,
            width: 390,
            height: 844,
        });

        await expectScreenshot();
    });
});
