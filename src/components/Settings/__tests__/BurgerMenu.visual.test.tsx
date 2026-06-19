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

    test('render story: <ViewMobileWithTabsScroll>', async ({mount, expectScreenshot}) => {
        await mount(<SettingsStories.ViewMobileWithTabsScroll />, undefined, {
            width: 400,
            height: 600,
        });

        await expectScreenshot();
    });

    test('render story: <Overflow>', async ({mount, expectScreenshot}) => {
        await mount(<SettingsStories.Overflow />);

        await expectScreenshot();
    });
});
