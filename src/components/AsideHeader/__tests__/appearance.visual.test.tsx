import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';

import {AsideHeader} from '../AsideHeader';
import {DecorationExample} from '../__playwright__/DecorationExample';
import {ItemPopup} from '../components/CompositeBar/Item/ItemPopup';
import {AsideFallback} from '../components/PageLayout/AsideFallback';
import {PageLayout} from '../components/PageLayout/PageLayout';

for (const menuDensity of ['default', 'compact'] as const) {
    test(`decoration geometry with quick access: ${menuDensity}`, async ({
        mount,
        page,
        expectScreenshot,
    }) => {
        await page.setViewportSize({width: 500, height: 400});
        const props = {compact: true, menuDensity};
        const component = await mount(<DecorationExample {...props} />, undefined, {
            width: 500,
            height: 400,
        });
        const decoration = page.locator('[class*="gn-aside-header__header-divider_"]');
        const header = page.locator('[class*="gn-aside-header__header_with-decoration"]');
        const initialHeaderBox = await header.boundingBox();
        const decorationBox = await decoration.boundingBox();
        if (!initialHeaderBox || !decorationBox) throw new Error('Expected visible decoration');
        expect(decorationBox.width / decorationBox.height).toBeCloseTo(56 / 29, 2);
        const backgroundHeight = await header.evaluate((element) =>
            parseFloat(getComputedStyle(element, '::before').height),
        );
        expect(backgroundHeight + decorationBox.height).toBeCloseTo(initialHeaderBox.height, 1);
        expect(decorationBox.y - initialHeaderBox.y).toBeCloseTo(backgroundHeight, 3);

        for (const quickAccess of [false, true]) {
            await component.update(
                <DecorationExample {...props} enableQuickAccess quickAccess={quickAccess} />,
            );
            expect((await header.boundingBox())?.height).toBe(initialHeaderBox.height);
            expect(await decoration.boundingBox()).toEqual(decorationBox);
        }
        await expectScreenshot({component: page.locator('[data-gn-aside-panel]')});

        await component.update(
            <PageLayout compact compactTransition={false} menuDensity={menuDensity}>
                <AsideFallback headerDecoration subheaderItemsCount={1} />
            </PageLayout>,
        );
        expect(await decoration.boundingBox()).toMatchObject({
            width: decorationBox.width,
            height: decorationBox.height,
        });

        await component.update(
            <DecorationExample {...props} enableQuickAccess hideSectionDividers />,
        );
        await expect(decoration).toBeHidden();
        await expect(header).toHaveCSS('padding-bottom', '0px');

        await component.update(<DecorationExample {...props} compact={false} enableQuickAccess />);
        await expect(decoration).toBeHidden();
        await expect(header).toHaveCSS('padding-bottom', '4px');
    });

    test(`tree connector width follows the shared token: ${menuDensity}`, async ({mount, page}) => {
        await mount(
            <AsideHeader
                compact={false}
                menuDensity={menuDensity}
                menuOverflow="scroll"
                menuGroups={[{id: 'group', title: 'Group', icon: Gear}]}
                menuItems={[
                    {id: 'first', title: 'First', groupId: 'group'},
                    {id: 'second', title: 'Second', groupId: 'group', current: true},
                ]}
            />,
            undefined,
            {width: 500, height: 400},
        );
        const connector = page
            .locator('[class*="gn-composite-bar__menu-group-nested-connector_spine-active"]')
            .first();
        for (const width of ['1px', '2px']) {
            if (width === '2px') {
                await page.locator('[data-gn-aside-panel]').evaluate((element) => {
                    (element as HTMLElement).style.setProperty(
                        '--gn-aside-header-menu-group-tree-line-width',
                        '2px',
                    );
                });
            }
            const spineWidths = await connector.evaluate((element) => [
                getComputedStyle(element, '::before').width,
                getComputedStyle(element, '::after').width,
            ]);
            expect(spineWidths).toEqual([width, width]);
            for (const path of await page.locator('[class*="nested-tree-svg"] path').all()) {
                await expect(path).toHaveCSS('stroke-width', width);
            }
        }
    });
}

for (const theme of ['light', 'dark', 'light-hc', 'dark-hc'] as const) {
    test(`popup surface survives late root styles: ${theme}`, async ({mount, page}) => {
        await mount(
            <ThemeProvider theme={theme}>
                <ItemPopup open variant="label" items={[{id: 'solo', title: 'Solo'}]}>
                    <button>Solo trigger</button>
                </ItemPopup>
                <ItemPopup open items={[{id: 'child', title: 'Child'}]}>
                    <button>Group trigger</button>
                </ItemPopup>
            </ThemeProvider>,
        );
        // Reproduce an application loading UIKit's root stylesheet after popup styles.
        await page.addStyleTag({
            content: '.g-root { background: var(--g-color-base-background); }',
        });
        const popups = page.locator('.g-popup');
        await expect(popups).toHaveCount(2);
        for (const popup of await popups.all()) {
            const surfaceColor = await popup.evaluate((element) =>
                getComputedStyle(element).getPropertyValue('--g-color-base-float').trim(),
            );
            await expect(popup).toHaveCSS('background-color', surfaceColor);
        }
        if (theme.startsWith('dark')) {
            const backgrounds = await popups.evaluateAll((elements) =>
                elements.map((element) => getComputedStyle(element).backgroundColor),
            );
            expect(backgrounds[0]).toBe(backgrounds[1]);
        }
        await page.addStyleTag({content: ':root { --g-popup-background-color: rgb(30, 60, 90); }'});
        for (const popup of await popups.all()) {
            await expect(popup).toHaveCSS('background-color', 'rgb(30, 60, 90)');
        }
    });
}
