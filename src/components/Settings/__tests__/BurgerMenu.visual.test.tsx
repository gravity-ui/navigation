import React from 'react';

import {test} from '~playwright/core';

import {SettingsStories} from './helpersPlaywright';

test.describe('Settings', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<SettingsStories.Showcase />);

        await expectScreenshot();
    });

    test('render story: <ViewMobile>', async ({mount, expectScreenshot}) => {
        await mount(<SettingsStories.ViewMobile />);

        await expectScreenshot();
    });
});
