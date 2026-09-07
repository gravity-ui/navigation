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
                })),
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
            await component.update(<AsideHeader {...props} />);
            await expect(footer).toHaveCSS('opacity', compact ? '0' : '1');
            expect(
                await header.evaluate(
                    (el) => getComputedStyle(el.parentElement as HTMLElement).paddingBottom,
                ),
            ).toBe(originalPadding);
        });
    }
}
