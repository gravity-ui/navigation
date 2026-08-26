import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';

import {Footer} from '../../Footer/desktop/Footer';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';

import {AsideHeaderExamplesStories, AsideHeaderStories} from './helpersPlaywright';

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

    test('scopes compact density to the AsideHeader logo', async ({mount, page}) => {
        await mount(
            <PageLayout compact={false} menuDensity="compact">
                <PageLayoutAside
                    logo={{text: 'Navigation logo', className: 'test-aside-header-logo'}}
                    hideCollapseButton
                />
                <PageLayout.Content>
                    <Footer
                        copyright="Gravity UI"
                        logo={{text: 'Footer logo', className: 'test-footer-logo'}}
                    />
                </PageLayout.Content>
            </PageLayout>,
            mountOptions,
            viewport,
        );

        await expect(page.locator('.test-aside-header-logo')).toHaveCSS('height', '32px');
        await expect(page.locator('.test-footer-logo')).toHaveCSS('height', '40px');
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

    test('render combined compact-density group popup', async ({mount, page, expectScreenshot}) => {
        await mount(
            <AsideHeaderExamplesStories.FullNavigation initialCompact />,
            mountOptions,
            viewport,
        );

        await page.locator('button[aria-label="Analytics"]').hover();
        await page.locator('button[aria-label="Overview"]').waitFor({state: 'visible'});

        await expect
            .poll(async () => {
                const titleContentX = await page
                    .locator('[class*="gn-composite-bar-item__popup-title_"]')
                    .evaluate((element) => {
                        const styles = getComputedStyle(element);

                        return (
                            element.getBoundingClientRect().x +
                            parseFloat(styles.paddingInlineStart)
                        );
                    });
                const iconPlaceBox = await page
                    .locator(
                        'button[aria-label="Overview"] [class*="gn-composite-bar-item__icon-place"]',
                    )
                    .boundingBox();

                return Math.abs(titleContentX - (iconPlaceBox?.x ?? 0));
            })
            .toBeLessThan(0.5);

        await expectScreenshot({
            component: page.locator('body'),
            screenshotName: 'AsideHeader combined compact-density group popup',
        });
    });

    test('render compact-density group popup without child icons', async ({
        mount,
        page,
        expectScreenshot,
    }) => {
        await mount(
            <AsideHeaderExamplesStories.FullNavigation
                initialCompact
                menuGroupNestedIcons={false}
            />,
            mountOptions,
            viewport,
        );

        await page.locator('button[aria-label="Analytics"]').hover();
        await page.locator('button[aria-label="Overview"]').waitFor({state: 'visible'});

        await expect
            .poll(async () => {
                const titleContentX = await page
                    .locator('[class*="gn-composite-bar-item__popup-title_"]')
                    .evaluate((element) => {
                        const styles = getComputedStyle(element);

                        return (
                            element.getBoundingClientRect().x +
                            parseFloat(styles.paddingInlineStart)
                        );
                    });
                const itemTitleBox = await page
                    .locator('button[aria-label="Overview"]')
                    .locator('[class*="gn-composite-bar-item__title_"]')
                    .first()
                    .boundingBox();

                return Math.abs(titleContentX - (itemTitleBox?.x ?? 0));
            })
            .toBeLessThan(0.5);

        await expectScreenshot({
            component: page.locator('body'),
            screenshotName: 'AsideHeader compact-density group popup without child icons',
        });
    });

    test('keeps compact-density group popup at its minimum width', async ({mount, page}) => {
        await mount(
            <AsideHeaderExamplesStories.FullNavigation initialCompact />,
            mountOptions,
            viewport,
        );

        await page.locator('button[aria-label="Settings"][aria-haspopup="dialog"]').hover();
        await page.locator('button[aria-label="General"]').waitFor({state: 'visible'});

        const popup = page.locator('[class*="gn-composite-bar-item__icon-popover_"]:visible');
        const popupContent = page.locator(
            '[class*="gn-composite-bar-item__popup-content_"]:visible',
        );
        const firstItem = page.locator('button[aria-label="General"]');

        await firstItem.hover();

        const popupBox = await popup.boundingBox();
        const popupContentBox = await popupContent.boundingBox();
        const firstItemBox = await firstItem.boundingBox();

        expect(popupBox?.width).toBe(200);
        expect(firstItemBox?.width).toBe(popupContentBox?.width);
    });

    test('opens and dismisses a group popup from the keyboard', async ({mount, page}) => {
        await mount(
            <AsideHeaderExamplesStories.FullNavigation initialCompact />,
            mountOptions,
            viewport,
        );

        const groupTrigger = page.locator('button[aria-label="Analytics"]');
        const popupItem = page.locator('button[aria-label="Overview"]');

        await groupTrigger.focus();
        await page.keyboard.press('Enter');
        await expect(popupItem).toBeVisible();

        await page.keyboard.press('Escape');
        await expect(popupItem).toBeHidden();

        await page.keyboard.press('Enter');
        await expect(popupItem).toBeVisible();
        await page.mouse.click(800, 400);
        await expect(popupItem).toBeHidden();
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

    test('highlights only the hovered item inside an expanded group', async ({
        mount,
        page,
        expectScreenshot,
    }) => {
        await mount(<AsideHeaderExamplesStories.FullNavigation />, mountOptions, viewport);

        const nestedItem = page.locator('button[aria-label="Weekly operational performance"]');
        const previousNestedItem = page.locator('button[aria-label="Reports"]');
        const nextNestedItem = page.locator('button[aria-label="Metrics"]');
        const groupListRow = page
            .locator('[class*="gn-composite-bar__root-menu-item_"]')
            .filter({has: nestedItem});

        await nestedItem.hover();

        await expect(groupListRow).toHaveCount(1);
        await expect(groupListRow).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        expect(
            await nestedItem.evaluate((element) => getComputedStyle(element).backgroundColor),
        ).not.toBe('rgba(0, 0, 0, 0)');

        const itemBox = await nestedItem.boundingBox();
        const previousItemBox = await previousNestedItem.boundingBox();
        const nextItemBox = await nextNestedItem.boundingBox();
        const titleBox = await nestedItem
            .locator('[class*="gn-composite-bar-item__title_"]')
            .boundingBox();
        const spineHeight = await page
            .locator('[class*="gn-composite-bar__menu-group-nested-list-item_"]')
            .filter({has: nestedItem})
            .evaluate((element) => Number.parseFloat(getComputedStyle(element, '::after').height));

        expect(itemBox?.height).toBe(44);
        expect(titleBox?.height).toBe(itemBox?.height);
        expect(spineHeight).toBe(45);
        expect(
            itemBox && previousItemBox ? itemBox.y - previousItemBox.y - previousItemBox.height : 0,
        ).toBe(1);
        expect(itemBox && nextItemBox ? nextItemBox.y - itemBox.y - itemBox.height : 0).toBe(1);

        await expectScreenshot({
            component: page.locator('body'),
            screenshotName: 'AsideHeader expanded nested item hover',
        });
    });

    test('keeps the List row behind an expanded action transparent', async ({mount, page}) => {
        await mount(<AsideHeaderExamplesStories.FullNavigation />, mountOptions, viewport);

        const action = page.locator('button[aria-label="Create"]');
        const actionListRow = page
            .locator('[class*="gn-composite-bar__root-menu-item_"]')
            .filter({has: action});

        await action.hover();

        await expect(actionListRow).toHaveCount(1);
        await expect(actionListRow).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    });

    test('render collapsed inline group popup', async ({mount, page, expectScreenshot}) => {
        await mount(<AsideHeaderExamplesStories.FullNavigation />, mountOptions, viewport);

        await page.locator('button[aria-label="Monitoring"]').hover();
        await page.locator('text=Alerts').waitFor({state: 'visible'});

        await expectScreenshot({
            component: page.locator('body'),
            screenshotName: 'AsideHeader collapsed inline group popup',
        });
    });

    test('render dark solo compact popup', async ({mount, page, expectScreenshot}) => {
        await mount(
            <AsideHeaderExamplesStories.FullNavigation initialCompact />,
            mountOptions,
            viewport,
        );

        await page.locator('button[aria-label="Home"]').hover();
        await page.locator('text=Home').last().waitFor({state: 'visible'});

        await expectScreenshot({
            component: page.locator('body'),
            screenshotName: 'AsideHeader dark solo compact popup',
        });
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
