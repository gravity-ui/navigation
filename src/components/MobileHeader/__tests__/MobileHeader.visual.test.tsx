import React from 'react';

import {test} from '~playwright/core';

import {MobileHeaderStories} from './helpersPlaywright';

test.describe('MobileHeader', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<MobileHeaderStories.Showcase />, undefined, {width: 390, height: 844});

        await expectScreenshot();
    });
});
