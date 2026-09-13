import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {ThemeProvider} from '@gravity-ui/uikit';
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
            if (!compact) {
                // Dividers outside the menu scrollport reach both aside edges. The
                // quick-access one is excluded: it scrolls with the menu content.
                const panelBox = await page.locator('[data-gn-aside-panel]').boundingBox();
                const headerBox = await header.boundingBox();
                const footerBox = await footer.boundingBox();
                if (!panelBox || !headerBox || !footerBox) {
                    throw new Error('Expected a visible panel with header and footer dividers');
                }
                expect(headerBox.x).toBe(panelBox.x);
                expect(headerBox.width).toBe(panelBox.width);
                expect(footerBox.x).toBe(panelBox.x);
                expect(footerBox.width).toBe(panelBox.width);
            }
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
                if (!scrollBox || !startBox || !aboveBox) {
                    throw new Error(
                        'Expected visible scrollport, scroll-start indicator and above-menu content',
                    );
                }
                expect(startBox.y).toBe(scrollBox.y);
                expect(startBox.y).toBe(aboveBox.y + aboveBox.height);
                const originalColor = await start.evaluate(
                    (el) => getComputedStyle(el).backgroundColor,
                );
                await page.locator('[data-gn-aside-panel]').evaluate((el) => {
                    (el as HTMLElement).style.setProperty(
                        '--gn-aside-header-divider-horizontal-color',
                        'transparent',
                    );
                });
                await expect(start).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
                await page.locator('[data-gn-aside-panel]').evaluate((el) => {
                    (el as HTMLElement).style.removeProperty(
                        '--gn-aside-header-divider-horizontal-color',
                    );
                });
                await expect(start).toHaveCSS('background-color', originalColor);
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

for (const theme of ['light', 'dark'] as const) {
    for (const hideSectionDividers of [false, true]) {
        test(`scroll shadows follow hidden content: theme=${theme}, hideSectionDividers=${hideSectionDividers}`, async ({
            mount,
            page,
        }) => {
            await page.setViewportSize({width: 1000, height: 600});
            const view = (count: number) => (
                <ThemeProvider theme={theme}>
                    <AsideHeader
                        compact={false}
                        compactTransition={false}
                        hideSectionDividers={hideSectionDividers}
                        logo={{text: 'Logo'}}
                        menuOverflow="scroll"
                        menuItems={Array.from({length: count}, (_, i) => ({
                            id: String(i),
                            title: `Item ${i}`,
                            icon: Gear,
                        }))}
                        renderFooter={() => <div>Footer</div>}
                    />
                </ThemeProvider>
            );
            const component = await mount(view(40));
            const scroll = page.locator('[data-gn-aside-scrollport]');
            const shadows = () =>
                scroll.evaluate((element) => {
                    const host = element.parentElement;
                    if (!host) throw new Error('Expected scroll container');
                    return ['::before', '::after'].map(
                        (pseudo) => getComputedStyle(host, pseudo).opacity,
                    );
                });
            await expect.poll(shadows).toEqual(['0', '0.7']);
            await scroll.evaluate((element) => {
                element.scrollTo({top: (element.scrollHeight - element.clientHeight) / 2});
            });
            await expect.poll(shadows).toEqual(['0.7', '0.7']);
            await scroll.evaluate((element) => {
                element.scrollTo({top: element.scrollHeight});
            });
            await expect.poll(shadows).toEqual(['0.7', '0']);
            await expect(
                page.locator(
                    `[data-gn-aside-divider="${hideSectionDividers ? 'scroll-end' : 'footer'}"]`,
                ),
            ).toHaveCSS('opacity', hideSectionDividers ? '0' : '1');
            await scroll.evaluate((element) => {
                element.scrollTo({top: 0});
            });
            await expect.poll(shadows).toEqual(['0', '0.7']);
            await component.update(view(1));
            await expect.poll(shadows).toEqual(['0', '0']);
        });
    }
}
