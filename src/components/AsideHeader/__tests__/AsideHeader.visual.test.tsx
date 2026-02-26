import React from 'react';

import {test} from '~playwright/core';

import {AsideHeaderStories} from './helpersPlaywright';

test.describe('AsideHeader', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Showcase />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <CollapsedNavigation>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CollapsedNavigation />, undefined, {
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

    test('render story: <CustomBackground>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CustomBackground />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <AdvancedUsage>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.AdvancedUsage />, undefined, {
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

    test('render story: <HeaderAlertCustom>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.HeaderAlertCustom />, undefined, {
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

    test('render story: <LineClamp>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.LineClamp />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <CollapseButtonWrapper>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CollapseButtonWrapper />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <ManyItems>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.ManyItems />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <GroupedMenuCollapsible>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.GroupedMenuCollapsible />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <CompactItemSizing>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CompactItemSizing />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <CustomThemesWithNewColors>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CustomThemesWithNewColors />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <FooterBarArray>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.FooterBarArray />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <FooterBarWithOverflow>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.FooterBarWithOverflow />, undefined, {
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });
});
