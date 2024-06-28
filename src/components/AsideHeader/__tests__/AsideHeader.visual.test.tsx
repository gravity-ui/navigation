import React from 'react';

import {test} from '~playwright/core';

import {AsideHeaderStories} from './helpersPlaywright';

test.describe('AsideHeader', () => {
    test('render story: <AdvancedUsage>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.AdvancedUsage />);

        await expectScreenshot();
    });

    test('render story: <Compact>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Compact />);

        await expectScreenshot();
    });

    test('render story: <CustomBackground>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CustomBackground />);

        await expectScreenshot();
    });

    test('render story: <CustomTheme>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CustomTheme />);

        await expectScreenshot();
    });

    test('render story: <Fallback>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Fallback />);

        await expectScreenshot();
    });

    test('render story: <HeaderAlert>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.HeaderAlert />);

        await expectScreenshot();
    });

    test('render story: <HeaderAlertCentered>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.HeaderAlertCentered />);

        await expectScreenshot();
    });

    test('render story: <MultipleTooltip>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.MultipleTooltip />);

        await expectScreenshot();
    });

    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Showcase />);

        await expectScreenshot();
    });
});
