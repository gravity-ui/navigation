import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';

import {Footer} from '../../Footer/desktop/Footer';
import {
    NestedMorePopupExample,
    QuickAccessOverflowExample,
    QuickAccessWrappedItemExample,
} from '../__playwright__/QuickAccessOverflowExample';
import {COMPOSITE_BAR_ITEM_ID_ATTRIBUTE} from '../components/CompositeBar/constants';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';

import {AsideHeaderExamplesStories, AsideHeaderStories} from './helpersPlaywright';

const mountOptions = undefined;
const viewport = {width: 1200, height: 720};
const quickAccessOverflowViewport = {width: 1200, height: 480};
const quickAccessCompactOverflowViewport = {width: 1200, height: 320};
const unifiedMenuScrollInner =
    '[class*="gn-aside-header__unified-menu-scroll_"] [class*="scrollable-with-scrollbar__scrollable-inner"]';

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

    test('renders footer items at the menu item height in default density', async ({
        mount,
        page,
    }) => {
        await mount(<AsideHeaderStories.Showcase />, mountOptions, viewport);

        await expect(page.locator('.gn-footer-item').first()).toHaveCSS('height', '40px');
    });

    test('keeps footer items at the compact height in compact density', async ({mount, page}) => {
        await mount(<AsideHeaderStories.CompactDensity />, mountOptions, viewport);

        await expect(page.locator('.gn-footer-item').first()).toHaveCSS('height', '32px');
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
            <AsideHeaderExamplesStories.FullNavigation initialCompact enableQuickAccess={false} />,
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
                enableQuickAccess={false}
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
            <AsideHeaderExamplesStories.FullNavigation initialCompact enableQuickAccess={false} />,
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
            <AsideHeaderExamplesStories.FullNavigation initialCompact enableQuickAccess={false} />,
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
        await mount(
            <AsideHeaderExamplesStories.FullNavigation enableQuickAccess={false} />,
            mountOptions,
            viewport,
        );

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
        await mount(
            <AsideHeaderExamplesStories.FullNavigation enableQuickAccess={false} />,
            mountOptions,
            viewport,
        );

        const action = page.locator('button[aria-label="Create"]');
        const actionListRow = page
            .locator('[class*="gn-composite-bar__root-menu-item_"]')
            .filter({has: action});

        await action.hover();

        await expect(actionListRow).toHaveCount(1);
        await expect(actionListRow).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    });

    test('render collapsed inline group popup', async ({mount, page, expectScreenshot}) => {
        await mount(
            <AsideHeaderExamplesStories.FullNavigation enableQuickAccess={false} />,
            mountOptions,
            viewport,
        );

        await page.locator('button[aria-label="Monitoring"]').hover();
        await page.locator('text=Alerts').waitFor({state: 'visible'});

        await expectScreenshot({
            component: page.locator('body'),
            screenshotName: 'AsideHeader collapsed inline group popup',
        });
    });

    test('render dark solo compact popup', async ({mount, page, expectScreenshot}) => {
        await mount(
            <AsideHeaderExamplesStories.FullNavigation initialCompact enableQuickAccess={false} />,
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

    test('render expanded quick access', async ({mount, page, expectScreenshot}) => {
        await mount(<AsideHeaderExamplesStories.FullNavigation />, mountOptions, viewport);

        await expect(page.locator('text="Pinned"')).toBeVisible();
        await expect(page.locator('button[aria-label="Overview"]')).toHaveCount(2);

        await expectScreenshot({
            component: page.locator('body'),
            screenshotName: 'AsideHeader expanded quick access',
        });
    });

    test('render quick access pin in a compact group popup', async ({
        mount,
        page,
        expectScreenshot,
    }) => {
        await mount(
            <AsideHeaderExamplesStories.FullNavigation initialCompact />,
            mountOptions,
            viewport,
        );

        await page.locator('button[aria-label="Monitoring"]').hover();
        const logsItem = page.locator('button[aria-label="Logs"]');
        await expect(logsItem).toBeVisible();
        await logsItem.hover();

        const interactiveRow = logsItem.locator('..');
        const pin = interactiveRow.locator('button[aria-label="Pin to quick access"]');
        const pinSlot = interactiveRow.locator('[class*="quick-access-pin-slot"]');
        await expect(pin).toBeVisible();
        await expect(pinSlot).toHaveCSS('opacity', '1');
        await page.waitForTimeout(200);

        await expectScreenshot({
            component: page.locator('body'),
            screenshotName: 'AsideHeader compact group popup quick access pin',
        });
    });

    test('does not render a quick access pin in a compact solo item popup', async ({
        mount,
        page,
    }) => {
        await mount(
            <AsideHeaderExamplesStories.FullNavigation initialCompact />,
            mountOptions,
            viewport,
        );

        await page
            .locator(
                '[id="gravity-ui/navigation-menu-items-composite-bar"] button[aria-label="Home"]',
            )
            .hover();
        await page.locator('text=Home').last().waitFor({state: 'visible'});

        await expect(page.locator('button[aria-label="Pin to quick access"]')).toHaveCount(0);
    });

    test('closes More after leaving a nested group popup', async ({mount, page}) => {
        await mount(<NestedMorePopupExample />, mountOptions, viewport);

        await page.locator('button[aria-label="More"]').hover();
        const groupItem = page.locator('button[aria-label="Nested group"]');
        await expect(groupItem).toBeVisible();
        await groupItem.hover();
        await expect(page.locator('button[aria-label="Group child A"]')).toBeVisible();

        await page.mouse.move(600, 400);

        await expect(page.locator('button[aria-label="Group child A"]')).toHaveCount(0);
        await expect(groupItem).toHaveCount(0);
    });

    test('keeps More open when returning from its nested group popup', async ({mount, page}) => {
        await mount(<NestedMorePopupExample />, mountOptions, viewport);

        await page.locator('button[aria-label="More"]').hover();
        const groupItem = page.locator('button[aria-label="Nested group"]');
        await groupItem.hover();

        const childItem = page.locator('button[aria-label="Group child A"]');
        await childItem.hover();
        await page.locator('button[aria-label="Second"]').hover();

        await expect(childItem).toHaveCount(0);
        await expect(groupItem).toBeVisible();
    });

    test('pins from an expanded row without navigating', async ({mount, page}) => {
        await mount(<AsideHeaderExamplesStories.FullNavigation />, mountOptions, viewport);

        const reportsItem = page.locator('button[aria-label="Reports"]');
        await reportsItem.hover();

        const pin = reportsItem.locator('..').getByRole('button', {name: 'Pin to quick access'});
        await expect(pin).toBeVisible();
        await pin.click();

        await expect(page.locator('button[aria-label="Reports"]')).toHaveCount(2);
        await expect(
            page.locator('text="Overview and recent activity for Overview."'),
        ).toBeVisible();
    });

    test('hides the pin after a pointer-selected row loses hover', async ({mount, page}) => {
        await mount(<AsideHeaderExamplesStories.FullNavigation />, mountOptions, viewport);

        const reportsItem = page.locator('button[aria-label="Reports"]');
        const pin = reportsItem.locator('..').getByRole('button', {name: 'Pin to quick access'});

        await reportsItem.hover();
        await expect(pin).toBeVisible();
        await reportsItem.click();
        await page.locator('text="Overview and recent activity for Reports."').hover();

        await expect(pin).not.toBeVisible();
    });

    test('keeps the expanded row hover surface while hovering its pin', async ({mount, page}) => {
        await mount(<AsideHeaderExamplesStories.FullNavigation />, mountOptions, viewport);

        const reportsItem = page.locator('button[aria-label="Reports"]');
        const pin = reportsItem.locator('..').getByRole('button', {name: 'Pin to quick access'});

        await reportsItem.hover();
        await expect(pin).toBeVisible();
        const rowHoverBackground = await reportsItem.evaluate(
            (element) => getComputedStyle(element).backgroundColor,
        );
        expect(rowHoverBackground).not.toBe('rgba(0, 0, 0, 0)');

        await pin.hover();
        await expect
            .poll(() =>
                reportsItem.evaluate((element) => getComputedStyle(element).backgroundColor),
            )
            .toBe(rowHoverBackground);
    });

    test('keeps an itemWrapper row hover surface while hovering its pin', async ({mount, page}) => {
        await mount(<QuickAccessWrappedItemExample />, mountOptions, viewport);

        const anchor = page.locator('[data-qa="quick-access-anchor-wrapper"]');
        const wrappedRow = anchor.locator(`[${COMPOSITE_BAR_ITEM_ID_ATTRIBUTE}="wrapped-item"]`);
        const pin = anchor.locator('..').getByRole('button', {name: 'Pin to quick access'});

        await anchor.hover();
        await expect(pin).toBeVisible();
        const rowHoverBackground = await wrappedRow.evaluate(
            (element) => getComputedStyle(element).backgroundColor,
        );
        expect(rowHoverBackground).not.toBe('rgba(0, 0, 0, 0)');

        await pin.hover();
        await expect
            .poll(() => wrappedRow.evaluate((element) => getComputedStyle(element).backgroundColor))
            .toBe(rowHoverBackground);
    });

    test('moves focus to an adjacent quick access row after keyboard unpin', async ({
        mount,
        page,
    }) => {
        await mount(<AsideHeaderExamplesStories.FullNavigation />, mountOptions, viewport);

        const quickAccess = page.locator('[id="gravity-ui/navigation-quick-access-composite-bar"]');
        const alertsItem = quickAccess.locator('button[aria-label="Alerts"]');
        const removeButton = alertsItem
            .locator('..')
            .getByRole('button', {name: 'Remove from quick access'});

        await alertsItem.focus();
        await page.keyboard.press('Tab');
        await expect(removeButton).toBeFocused();
        await page.keyboard.press('Enter');

        await expect(alertsItem).toHaveCount(0);
        await expect(quickAccess.locator('button[aria-label="Overview"]')).toBeFocused();
    });

    test('highlights a pinned current item only in quick access by default', async ({
        mount,
        page,
    }) => {
        await mount(<AsideHeaderExamplesStories.FullNavigation />, mountOptions, viewport);

        const overviewItems = page.locator('button[aria-label="Overview"]');
        await expect(overviewItems).toHaveCount(2);

        const quickAccessBackground = await overviewItems
            .nth(0)
            .evaluate((element) => getComputedStyle(element).backgroundColor);
        const mainMenuBackground = await overviewItems
            .nth(1)
            .evaluate((element) => getComputedStyle(element).backgroundColor);

        expect(quickAccessBackground).not.toBe('rgba(0, 0, 0, 0)');
        expect(mainMenuBackground).toBe('rgba(0, 0, 0, 0)');
    });

    test('can highlight a pinned current item in both sections', async ({mount, page}) => {
        await mount(
            <AsideHeaderExamplesStories.FullNavigation quickAccessHighlightInMainMenu />,
            mountOptions,
            viewport,
        );

        const overviewItems = page.locator('button[aria-label="Overview"]');
        await expect(overviewItems).toHaveCount(2);

        for (const index of [0, 1]) {
            expect(
                await overviewItems
                    .nth(index)
                    .evaluate((element) => getComputedStyle(element).backgroundColor),
            ).not.toBe('rgba(0, 0, 0, 0)');
        }
    });

    test('scrolls quick access and menu together in expanded scroll mode', async ({
        mount,
        page,
    }) => {
        // The mount style sizes the wrapper only; the aside resolves 100vh against the
        // real viewport. Shrink it so the unified column actually overflows.
        await page.setViewportSize(quickAccessOverflowViewport);
        await mount(<QuickAccessOverflowExample />, mountOptions, quickAccessOverflowViewport);

        const scrollInner = page.locator(unifiedMenuScrollInner);
        const quickAccessItem = page
            .locator('[id="gravity-ui/navigation-quick-access-composite-bar"]')
            .locator('button[aria-label="Home"]');
        const menuItem = page
            .locator('[id="gravity-ui/navigation-menu-items-composite-bar"]')
            .locator('button[aria-label="Help"]');
        const logo = page.locator('[class*="gn-aside-header__logo_"]');
        const aboveMenu = page.locator('[data-qa="quick-access-overflow-above-menu"]');
        const footer = page.locator('[data-qa="quick-access-overflow-footer"]');

        await expect(quickAccessItem).toBeAttached();
        await expect(menuItem).toBeAttached();

        const beforeQuickAccessY = (await quickAccessItem.boundingBox())?.y ?? 0;
        const beforeMenuItemY = (await menuItem.boundingBox())?.y ?? 0;
        const beforeLogoY = (await logo.boundingBox())?.y ?? 0;
        const beforeAboveMenuY = (await aboveMenu.boundingBox())?.y ?? 0;
        const beforeFooterY = (await footer.boundingBox())?.y ?? 0;

        await scrollInner.evaluate((element) => {
            element.scrollTo(0, 250);
        });
        await expect
            .poll(() => scrollInner.evaluate((element) => element.scrollTop))
            .toBeGreaterThan(0);
        const scrollTop = await scrollInner.evaluate((element) => element.scrollTop);

        // Scrolled rows move by exactly the applied scroll offset...
        expect(
            Math.abs(
                ((await quickAccessItem.boundingBox())?.y ?? 0) - (beforeQuickAccessY - scrollTop),
            ),
        ).toBeLessThan(0.5);
        expect(
            Math.abs(((await menuItem.boundingBox())?.y ?? 0) - (beforeMenuItemY - scrollTop)),
        ).toBeLessThan(0.5);
        // ...while the header, content above the menu, and footer stay fixed.
        expect(Math.abs(((await logo.boundingBox())?.y ?? 0) - beforeLogoY)).toBeLessThan(0.5);
        expect(Math.abs(((await aboveMenu.boundingBox())?.y ?? 0) - beforeAboveMenuY)).toBeLessThan(
            0.5,
        );
        expect(Math.abs(((await footer.boundingBox())?.y ?? 0) - beforeFooterY)).toBeLessThan(0.5);

        await expect(page.locator('[class*="gn-aside-header__footer_with-divider"]')).toHaveCount(
            1,
        );
    });

    test('scrolls the unified column in expanded collapse mode and keeps More reachable', async ({
        mount,
        page,
    }) => {
        await page.setViewportSize(quickAccessOverflowViewport);
        await mount(
            <QuickAccessOverflowExample menuOverflow="collapse" />,
            mountOptions,
            quickAccessOverflowViewport,
        );

        const scrollInner = page.locator(unifiedMenuScrollInner);
        const quickAccessItem = page
            .locator('[id="gravity-ui/navigation-quick-access-composite-bar"]')
            .locator('button[aria-label="Home"]');
        const more = page
            .locator('[id="gravity-ui/navigation-menu-items-composite-bar"]')
            .locator('button[aria-label="More"]');
        const logo = page.locator('[class*="gn-aside-header__logo_"]');
        const aboveMenu = page.locator('[data-qa="quick-access-overflow-above-menu"]');
        const footer = page.locator('[data-qa="quick-access-overflow-footer"]');

        await expect(quickAccessItem).toBeAttached();
        await expect(more).toBeAttached();

        const beforeQuickAccessY = (await quickAccessItem.boundingBox())?.y ?? 0;
        const beforeMoreY = (await more.boundingBox())?.y ?? 0;
        const beforeLogoY = (await logo.boundingBox())?.y ?? 0;
        const beforeAboveMenuY = (await aboveMenu.boundingBox())?.y ?? 0;
        const beforeFooterY = (await footer.boundingBox())?.y ?? 0;

        await scrollInner.evaluate((element) => {
            element.scrollTo(0, element.scrollHeight);
        });
        await expect
            .poll(() => scrollInner.evaluate((element) => element.scrollTop))
            .toBeGreaterThan(0);
        const scrollTop = await scrollInner.evaluate((element) => element.scrollTop);

        // Scrolled rows (including the More row) move by exactly the applied scroll offset...
        expect(
            Math.abs(
                ((await quickAccessItem.boundingBox())?.y ?? 0) - (beforeQuickAccessY - scrollTop),
            ),
        ).toBeLessThan(0.5);
        expect(
            Math.abs(((await more.boundingBox())?.y ?? 0) - (beforeMoreY - scrollTop)),
        ).toBeLessThan(0.5);
        // ...while the header, content above the menu, and footer stay fixed.
        expect(Math.abs(((await logo.boundingBox())?.y ?? 0) - beforeLogoY)).toBeLessThan(0.5);
        expect(Math.abs(((await aboveMenu.boundingBox())?.y ?? 0) - beforeAboveMenuY)).toBeLessThan(
            0.5,
        );
        expect(Math.abs(((await footer.boundingBox())?.y ?? 0) - beforeFooterY)).toBeLessThan(0.5);

        // More stays in the DOM and reachable after the joint scroll.
        await expect(more).toBeAttached();
        await expect(more).toBeVisible();
    });

    test('scrolls the unified column in compact mode and keeps the footer fixed', async ({
        mount,
        page,
    }) => {
        await page.setViewportSize(quickAccessCompactOverflowViewport);
        await mount(
            <QuickAccessOverflowExample compact />,
            mountOptions,
            quickAccessCompactOverflowViewport,
        );

        const scrollInner = page.locator(unifiedMenuScrollInner);
        const quickAccessItem = page
            .locator('[id="gravity-ui/navigation-quick-access-composite-bar"]')
            .locator('button[aria-label="Home"]');
        const more = page
            .locator('[id="gravity-ui/navigation-menu-items-composite-bar"]')
            .locator('button[aria-label="More"]');
        const logo = page.locator('[class*="gn-aside-header__logo_"]');
        const footer = page.locator('[data-qa="quick-access-overflow-footer"]');

        await expect(quickAccessItem).toBeAttached();
        await expect(more).toBeAttached();

        const beforeQuickAccessY = (await quickAccessItem.boundingBox())?.y ?? 0;
        const beforeMoreY = (await more.boundingBox())?.y ?? 0;
        const beforeLogoY = (await logo.boundingBox())?.y ?? 0;
        const beforeFooterBox = await footer.boundingBox();

        await scrollInner.evaluate((element) => {
            element.scrollTo(0, element.scrollHeight);
        });
        await expect
            .poll(() => scrollInner.evaluate((element) => element.scrollTop))
            .toBeGreaterThan(0);
        const scrollTop = await scrollInner.evaluate((element) => element.scrollTop);

        // Scrolled rows move by exactly the applied scroll offset; elements are
        // found inside their own composite containers (same labels in both sections).
        expect(
            Math.abs(
                ((await quickAccessItem.boundingBox())?.y ?? 0) - (beforeQuickAccessY - scrollTop),
            ),
        ).toBeLessThan(0.5);
        expect(
            Math.abs(((await more.boundingBox())?.y ?? 0) - (beforeMoreY - scrollTop)),
        ).toBeLessThan(0.5);
        // The header and the footer keep their bounding boxes, not just visibility.
        expect(Math.abs(((await logo.boundingBox())?.y ?? 0) - beforeLogoY)).toBeLessThan(0.5);
        const afterFooterBox = await footer.boundingBox();
        expect(Math.abs((afterFooterBox?.y ?? 0) - (beforeFooterBox?.y ?? 0))).toBeLessThan(0.5);
        expect(afterFooterBox?.x).toBe(beforeFooterBox?.x);
        expect(afterFooterBox?.height).toBe(beforeFooterBox?.height);
        await expect(footer).toBeVisible();
    });

    test('keeps an anchor itemWrapper and its pin separate in keyboard order', async ({
        mount,
        page,
    }) => {
        await mount(<QuickAccessWrappedItemExample />, mountOptions, viewport);

        const anchor = page.locator('[data-qa="quick-access-anchor-wrapper"]');
        const interactiveRow = anchor.locator('..');
        const pin = interactiveRow.locator('button[aria-label="Pin to quick access"]');
        const initialUrl = page.url();

        await expect(anchor.locator('button')).toHaveCount(0);
        await page.keyboard.press('Tab');
        await expect(anchor).toBeFocused();
        await expect(pin).toBeVisible();
        await page.keyboard.press('Tab');
        await expect(pin).toBeFocused();
        await page.keyboard.press('Enter');
        expect(page.url()).toBe(initialUrl);
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
