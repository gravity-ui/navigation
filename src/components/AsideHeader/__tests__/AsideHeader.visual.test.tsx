import React from 'react';

import {test} from '~playwright/core';

import {AsideHeaderStories} from './helpersPlaywright';

test.describe('AsideHeader', () => {
    test('render story: <AdvancedUsage>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.AdvancedUsage />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <Compact>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Compact />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <CustomBackground>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CustomBackground />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <CustomTheme>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CustomTheme />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <Fallback>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Fallback />, undefined, {
            padding: 20,
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
            padding: 20,
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Showcase />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });
});
