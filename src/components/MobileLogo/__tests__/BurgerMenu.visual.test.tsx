import React from 'react';

import {test} from '~playwright/core';

import {MobileLogoStories} from './helpersPlaywright';

test.describe('MobileLogo', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<MobileLogoStories.Showcase />);

        await expectScreenshot();
    });
});
