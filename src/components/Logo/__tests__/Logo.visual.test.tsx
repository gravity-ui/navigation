import React from 'react';

import {test} from '~playwright/core';

import {LogoStories} from './helpersPlaywright';

test.describe('Logo', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<LogoStories.Showcase />);

        await expectScreenshot();
    });
});
