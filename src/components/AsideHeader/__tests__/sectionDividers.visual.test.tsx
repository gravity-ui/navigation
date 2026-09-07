import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';

import {AsideHeader} from '../AsideHeader';

for (const compact of [false, true]) {
    for (const quickAccess of [false, true]) {
        test(`section divider spacing: compact=${compact}, quickAccess=${quickAccess}`, async ({
            mount,
            page,
        }) => {
            const props = {
                compact,
                compactTransition: false,
                headerDecoration: true,
                enableQuickAccess: quickAccess,
                onQuickAccessChange: () => {},
                logo: {text: 'Logo'},
                menuOverflow: 'scroll' as const,
                menuItems: Array.from({length: 40}, (_, i) => ({
                    id: String(i),
                    title: `Item ${i}`,
                    icon: Gear,
                    quickAccess: i === 0,
                })),
                aboveMenuContent: <div data-qa="above-menu">Above menu</div>,
                renderFooter: () => <div>Footer</div>,
            };
            const component = await mount(<AsideHeader {...props} />, undefined, {
                width: 1000,
                height: 400,
            });
            const header = page.locator('[data-gn-aside-divider="header"]');
            const footer = page.locator('[data-gn-aside-divider="footer"]');
            await expect(footer).toHaveCSS('opacity', compact ? '0' : '1');
            const originalPadding = await header.evaluate(
                (el) => getComputedStyle(el.parentElement as HTMLElement).paddingBottom,
            );
            expect(parseFloat(originalPadding)).toBeGreaterThan(0);
            await component.update(<AsideHeader {...props} hideSectionDividers />);
            await expect(header).toBeHidden();
            await expect(footer).toBeHidden();
            expect(
                await header.evaluate(
                    (el) => getComputedStyle(el.parentElement as HTMLElement).paddingBottom,
                ),
            ).toBe('0px');
            expect(
                await header.evaluate(
                    (el) => getComputedStyle(el.parentElement as HTMLElement).marginBottom,
                ),
            ).toBe('0px');
            expect(
                await footer.evaluate(
                    (el) => getComputedStyle(el.parentElement as HTMLElement).marginTop,
                ),
            ).toBe('0px');
            if (compact) {
                await expect(
                    page.locator('[class*="gn-aside-header__header-divider_"]'),
                ).toBeHidden();
            }
            const start = page.locator('[data-gn-aside-divider="scroll-start"]');
            const end = page.locator('[data-gn-aside-divider="scroll-end"]');
            const scroll = page.locator('[data-gn-aside-scrollport]');
            await expect(start).toHaveCSS('opacity', '0');
            await expect(end).toHaveCSS('opacity', compact ? '0' : '1');
            if (quickAccess) {
                expect(
                    await page
                        .locator('[data-gn-aside-divider]')
                        .evaluateAll((els) =>
                            els.map((el) => el.getAttribute('data-gn-aside-divider')),
                        ),
                ).toEqual(['header', 'quick-access', 'scroll-start', 'scroll-end', 'footer']);
            }
            if (!compact) {
                const geometry = () =>
                    scroll.evaluate((el) => {
                        const rows = el.querySelectorAll('[data-gn-composite-bar-item-id]');
                        const rect = el.getBoundingClientRect();
                        return {
                            height: el.clientHeight,
                            first: rows[0]?.getBoundingClientRect().top - rect.top + el.scrollTop,
                            last:
                                rows[rows.length - 1]?.getBoundingClientRect().top -
                                rect.top +
                                el.scrollTop,
                        };
                    });
                const before = await geometry();
                expect(Number.isFinite(before.first)).toBe(true);
                expect(Number.isFinite(before.last)).toBe(true);
                await scroll.evaluate((el) => {
                    el.scrollTo(0, (el.scrollHeight - el.clientHeight) / 2);
                });
                await expect(start).toHaveCSS('opacity', '1');
                await expect(end).toHaveCSS('opacity', '1');
                expect(await geometry()).toEqual(before);
                await scroll.evaluate((el) => {
                    el.scrollTo(0, el.scrollHeight);
                });
                await expect(start).toHaveCSS('opacity', '1');
                await expect(end).toHaveCSS('opacity', '0');
                expect(await geometry()).toEqual(before);
                const scrollBox = await scroll.boundingBox();
                const startBox = await start.boundingBox();
                const aboveBox = await page.locator('[data-qa="above-menu"]').boundingBox();
                expect(startBox?.y).toBe(scrollBox?.y);
                expect(startBox?.y).toBe((aboveBox?.y ?? 0) + (aboveBox?.height ?? 0));
                await page.locator('[data-gn-aside-panel]').evaluate((el) => {
                    (el as HTMLElement).style.setProperty(
                        '--gn-aside-header-divider-horizontal-color',
                        'transparent',
                    );
                });
                await expect(start).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
                await page.setViewportSize({width: 1000, height: 2400});
                await expect(start).toHaveCSS('opacity', '0');
                await expect(end).toHaveCSS('opacity', '0');
                await page.setViewportSize({width: 1000, height: 400});
            }
            await component.update(<AsideHeader {...props} />);
            await expect(start).toHaveCount(0);
            await expect(end).toHaveCount(0);
            await expect(footer).toHaveCSS('opacity', compact ? '0' : '1');
            expect(
                await header.evaluate(
                    (el) => getComputedStyle(el.parentElement as HTMLElement).paddingBottom,
                ),
            ).toBe(originalPadding);
        });
    }
}
