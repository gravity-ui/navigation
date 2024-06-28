import React from 'react';

import {test} from '~playwright/core';

import {ActionBarStories} from './helpersPlaywright';

test.describe('ActionBar', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<ActionBarStories.Showcase />);

        await expectScreenshot();
    });

    test('render story: <SingleSection>', async ({mount, expectScreenshot}) => {
        await mount(<ActionBarStories.SingleSection />);

        await expectScreenshot();
    });
});
