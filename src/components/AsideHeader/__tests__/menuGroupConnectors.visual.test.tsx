import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';

import {AsideHeader} from '../AsideHeader';

for (const menuDensity of ['default', 'compact'] as const) {
    for (const direction of ['ltr', 'rtl'] as const) {
        test(`connects the last automatic-height row without a gap (${menuDensity}, ${direction})`, async ({
            mount,
            page,
        }, testInfo) => {
            const example = (multiline: boolean, current: boolean) => (
                <div dir={direction}>
                    <AsideHeader
                        compact={false}
                        menuDensity={menuDensity}
                        menuOverflow="scroll"
                        menuGroups={[{id: 'group', title: 'Group', icon: Gear}]}
                        menuItems={[
                            {id: 'first', title: 'First item', icon: Gear, groupId: 'group'},
                            {
                                id: 'last',
                                title: multiline
                                    ? 'Длинное название последнего пункта группы'
                                    : 'Last item',
                                icon: Gear,
                                groupId: 'group',
                                current,
                            },
                        ]}
                    />
                </div>
            );
            const component = await mount(example(false, false));
            await page.evaluate(() => document.fonts.ready);
            const group = page.locator('[data-gn-aside-group="group"]');
            for (const [multiline, current, largeText] of [
                [false, false, false],
                [true, false, false],
                [true, true, false],
                [false, true, false],
                [true, true, true],
            ]) {
                await component.update(example(multiline, current));
                if (largeText) {
                    await group
                        .locator('[data-gn-composite-bar-item-id="last"]')
                        .evaluate((node) => {
                            node.style.setProperty('font-size', '20px');
                            node.style.setProperty('line-height', '40px');
                        });
                }
                const geometry = await group.evaluate((element) => {
                    const connectors = element.querySelectorAll<HTMLElement>(
                        '[class*="__menu-group-nested-connector_"]',
                    );
                    const first = connectors[0];
                    const last = connectors[1];
                    const path = last?.querySelector('path');
                    const matrix = path?.getScreenCTM();
                    const title = last?.parentElement?.querySelector('[class*="__title-text"]');
                    if (!first || !last || !path || !matrix || !title)
                        throw new Error('Missing tree connectors');
                    const firstRect = first.getBoundingClientRect();
                    const lastRect = last.getBoundingClientRect();
                    const start = path.getPointAtLength(0).matrixTransform(matrix);
                    const end = path
                        .getPointAtLength(path.getTotalLength())
                        .matrixTransform(matrix);
                    const neutral = getComputedStyle(last, '::after');
                    const active = getComputedStyle(last, '::before');
                    const paintedBottom = (rect: DOMRect, style: CSSStyleDeclaration) =>
                        style.content === 'none'
                            ? rect.top
                            : rect.bottom - parseFloat(style.bottom);
                    return {
                        height: lastRect.height,
                        rowTop: lastRect.top,
                        previousBottom: paintedBottom(
                            firstRect,
                            getComputedStyle(first, '::after'),
                        ),
                        neutralTop: lastRect.top + parseFloat(neutral.top),
                        neutralBottom: paintedBottom(lastRect, neutral),
                        activeBottom: paintedBottom(lastRect, active),
                        activeColor: active.backgroundColor,
                        stroke: getComputedStyle(path).stroke,
                        elbowTop: start.y,
                        elbowEnd: end.y,
                        firstLineCenter:
                            title.getBoundingClientRect().top +
                            parseFloat(getComputedStyle(title).lineHeight) / 2,
                    };
                });
                const baseHeight = menuDensity === 'default' ? 40 : 32;
                if (multiline) expect(geometry.height).toBeGreaterThan(baseHeight);
                else expect(geometry.height).toBe(baseHeight);
                expect(geometry.previousBottom).toBeCloseTo(geometry.rowTop, 1);
                expect(geometry.neutralTop).toBeCloseTo(geometry.rowTop, 1);
                expect(geometry.neutralBottom).toBeCloseTo(geometry.elbowTop, 1);
                expect(geometry.elbowEnd).toBeCloseTo(geometry.firstLineCenter, 1);
                if (current) {
                    expect(geometry.activeBottom).toBeCloseTo(geometry.elbowTop, 1);
                    expect(geometry.activeColor).toBe(geometry.stroke);
                }
                if (multiline) {
                    await group.screenshot({
                        path: testInfo.outputPath(
                            `last-row-${current ? 'current' : 'regular'}${largeText ? '-large-text' : ''}.png`,
                        ),
                    });
                }
            }
        });
    }
}
