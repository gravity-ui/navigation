import React from 'react';

import {test} from '~playwright/core';

import {AsideHeaderStories} from './helpersPlaywright';

test.describe('AsideHeader', () => {
    test('render story: <AdvancedUsage>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.AdvancedUsage />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <Compact>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Compact />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <CustomBackground>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CustomBackground />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <CustomTheme>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CustomTheme />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <Fallback>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Fallback />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <HeaderAlert>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.HeaderAlert />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <HeaderAlertCentered>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.HeaderAlertCentered />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <MultipleTooltip>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.MultipleTooltip />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Showcase />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <LineClamp>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.LineClamp />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });
});
