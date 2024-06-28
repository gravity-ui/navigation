import React from 'react';

import {test} from '~playwright/core';

import {DrawerStories} from './helpersPlaywright';

test.describe('DrawerStories', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<DrawerStories.Showcase />);

        await expectScreenshot();
    });
});
