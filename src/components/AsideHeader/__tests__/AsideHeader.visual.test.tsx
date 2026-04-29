import React from 'react';

import {test} from '~playwright/core';

import {AsideHeaderStories} from './helpersPlaywright';

const mountOptions = undefined;
const viewport = {width: 1200, height: 720};

test.describe('AsideHeader', () => {
    /** Order matches exports in `@stories__/AsideHeader.stories.tsx`. Explicit components — dynamic `Stories[key]` breaks Playwright CT. */
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Showcase />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <Compact>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Compact />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <CustomTheme>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CustomTheme />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <CustomBackground>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CustomBackground />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <AdvancedUsage>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.AdvancedUsage />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <HeaderAlert>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.HeaderAlert />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <HeaderAlertCentered>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.HeaderAlertCentered />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <HeaderAlertCustom>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.HeaderAlertCustom />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <Fallback>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.Fallback />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <LineClamp>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.LineClamp />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <CollapseButtonWrapper>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CollapseButtonWrapper />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <MenuGroups>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.MenuGroups />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <MenuGroupsCompact>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.MenuGroupsCompact />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <MenuGroupsScrollbar>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.MenuGroupsScrollbar />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <MenuScrollbar>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.MenuScrollbar />, mountOptions, viewport);
        await expectScreenshot();
    });
});
