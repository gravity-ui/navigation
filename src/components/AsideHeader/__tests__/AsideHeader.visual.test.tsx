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

    test('render story: <CompactDensity>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CompactDensity />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <CompactDensityCollapsed>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CompactDensityCollapsed />, mountOptions, viewport);
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

    test('render story: <AdvancedCompactDensity>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.AdvancedCompactDensity />, mountOptions, viewport);
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

    test('render story: <CompactDensityMenuGroups>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CompactDensityMenuGroups />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render compact-density group popup', async ({mount, page, expectScreenshot}) => {
        await mount(<AsideHeaderStories.CompactDensityMenuGroups />, mountOptions, viewport);

        await page.locator('button[aria-label="Analytics"]').hover();
        await page.locator('text=Overview').waitFor({state: 'visible'});

        await expectScreenshot({
            component: page.locator('body'),
            screenshotName: 'AsideHeader compact-density group popup',
        });
    });

    test('render compact-density bringForward over modal', async ({
        mount,
        page,
        expectScreenshot,
    }) => {
        await mount(<AsideHeaderStories.CompactDensity />, mountOptions, viewport);

        await page.locator('button:has-text("Open Modal")').click();
        await page.locator('.gn-composite-bar-highlighted-item').waitFor({state: 'visible'});

        await expectScreenshot({
            component: page.locator('body'),
            screenshotName: 'AsideHeader compact-density bringForward over modal',
        });
    });

    test('render story: <MenuGroupsScrollbar>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.MenuGroupsScrollbar />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <MenuScrollbar>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.MenuScrollbar />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <AboveMenuContent>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.AboveMenuContent />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <AboveMenuContentCompact>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.AboveMenuContentCompact />, mountOptions, viewport);
        await expectScreenshot();
    });

    test('render story: <AboveMenuContentScrollbar>', async ({mount, expectScreenshot}) => {
        await mount(<AsideHeaderStories.AboveMenuContentScrollbar />, mountOptions, viewport);
        await expectScreenshot();
    });
});
