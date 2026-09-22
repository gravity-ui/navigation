/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';

import {expect} from '@playwright/experimental-ct-react';
import type {Locator} from '@playwright/test';

import {test} from '~playwright/core';

import {AutomaticTitleExample} from '../__playwright__/AutomaticTitleExample';

import {AsideHeaderStories} from './helpersPlaywright';

const row = (parent: Locator, id: string) =>
    parent.locator(`[data-gn-composite-bar-item-id="${id}"]`);
const height = (element: Locator) =>
    element.evaluate((node) => node.getBoundingClientRect().height);
const lines = (element: Locator) =>
    element.locator('[class*="__title-text"]').evaluate((node) => {
        const style = getComputedStyle(node);
        return node.getBoundingClientRect().height / parseFloat(style.lineHeight);
    });

const expectIconAtFirstLine = async (element: Locator) => {
    const offset = await element.evaluate((node) => {
        const icon = node.querySelector('[data-gn-aside-part="icon"] svg');
        const title = node.querySelector('[class*="__title-text"]');
        if (!icon || !title) throw new Error('Missing icon or title');
        const iconRect = icon.getBoundingClientRect();
        const firstLineCenter =
            title.getBoundingClientRect().top + parseFloat(getComputedStyle(title).lineHeight) / 2;
        return iconRect.top + iconRect.height / 2 - firstLineCenter;
    });
    expect(Math.abs(offset)).toBeLessThanOrEqual(0.5);
};

for (const menuDensity of ['default', 'compact'] as const) {
    test(`automatic title adapts to locale, width and compact state (${menuDensity})`, async ({
        mount,
        page,
    }, testInfo) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        const component = await mount(<AutomaticTitleExample menuDensity={menuDensity} />);
        await page.evaluate(() => document.fonts.ready);
        const menu = page.getByTestId('menu');
        const short = row(menu, 'short');
        const long = row(menu, 'long');
        const base = menuDensity === 'default' ? 40 : 32;
        await expect.poll(() => height(short)).toBe(base);
        await expect.poll(() => lines(long)).toBe(2);
        expect(await height(long)).toBeGreaterThan(base);
        await expectIconAtFirstLine(short);
        await expectIconAtFirstLine(long);
        await page.screenshot({path: testInfo.outputPath('automatic-title.png')});

        await component.update(
            <AutomaticTitleExample menuDensity={menuDensity} title="Monitoring" />,
        );
        await expect.poll(() => height(long)).toBe(base);
        await expectIconAtFirstLine(long);
        await component.update(<AutomaticTitleExample menuDensity={menuDensity} width={420} />);
        await expect.poll(() => lines(long)).toBe(1);
        await expect.poll(() => height(long)).toBe(base);
        await component.update(<AutomaticTitleExample menuDensity={menuDensity} compact />);
        await expect.poll(() => height(long)).toBe(base);
        await component.update(<AutomaticTitleExample menuDensity={menuDensity} />);
        await expect.poll(() => lines(long)).toBe(2);
        await expectIconAtFirstLine(long);
        expect(errors).toEqual([]);
    });
}

test('automatic title clamps long words and keeps nested, quick-access and footer rows independent', async ({
    mount,
    page,
}) => {
    const component = await mount(
        <AutomaticTitleExample grouped quickAccess title="Notification methods" />,
    );
    const menu = page.getByTestId('menu');
    const quick = page.getByTestId('quick-access');
    const nested = row(menu, 'long');
    await expect.poll(() => lines(nested)).toBe(2);
    await expect.poll(() => lines(row(quick, 'long'))).toBe(1);
    const longWord = 'VeryLongUnbreakableResourceName'.repeat(8);
    await component.update(<AutomaticTitleExample grouped quickAccess title={longWord} />);
    for (const item of [nested, row(quick, 'long'), row(page.locator('body'), 'footer')]) {
        await expect.poll(() => lines(item)).toBe(2);
        await expectIconAtFirstLine(item);
        const text = item.locator('[class*="__title-text"]');
        expect(await text.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
        expect(await text.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    }
    const bounds = await menu.evaluate((node) => {
        const nestedRow = node.querySelector('[data-gn-composite-bar-item-id="long"]');
        const last = node.querySelector('[data-gn-composite-bar-item-id="last"]');
        if (!nestedRow || !last) throw new Error('Missing menu rows');
        return {
            bottom: nestedRow.getBoundingClientRect().bottom,
            next: last.getBoundingClientRect().top,
        };
    });
    expect(bounds.next).toBeGreaterThanOrEqual(bounds.bottom);
});

test('automatic title measures More overflow and recovers hidden rows after resizing or translation', async ({
    mount,
    page,
}) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const component = await mount(<AutomaticTitleExample menuOverflow="collapse" height={100} />);
    const menu = page.getByTestId('menu');
    await expect(menu.getByRole('button', {name: 'More'})).toBeVisible();
    await expect(row(menu, 'last')).toHaveCount(0);
    await expect
        .poll(async () =>
            menu.evaluate((node) => {
                const bottom = Math.max(
                    ...Array.from(
                        node.querySelectorAll('.g-list__item'),
                        (item) => item.getBoundingClientRect().bottom,
                    ),
                );
                return bottom <= node.getBoundingClientRect().bottom;
            }),
        )
        .toBe(true);
    await component.update(
        <AutomaticTitleExample menuOverflow="collapse" height={100} width={420} />,
    );
    await expect(row(menu, 'last')).toBeVisible();
    await expect(menu.getByRole('button', {name: 'More'})).toHaveCount(0);
    await component.update(<AutomaticTitleExample menuOverflow="collapse" height={100} />);
    await expect(menu.getByRole('button', {name: 'More'})).toBeVisible();
    await component.update(
        <AutomaticTitleExample menuOverflow="collapse" height={100} title="Monitoring" />,
    );
    await expect(row(menu, 'last')).toBeVisible();
    await expect(menu.getByRole('button', {name: 'More'})).toHaveCount(0);
    expect(errors).toEqual([]);
});

test('automatic title is stable at fractional wrap boundaries and follows typography changes', async ({
    mount,
    page,
}) => {
    await mount(<AutomaticTitleExample width={420} />);
    await page.evaluate(() => document.fonts.ready);
    const menu = page.getByTestId('menu');
    const long = row(menu, 'long');
    const boundary = await long.evaluate((node) => {
        const title = node.querySelector<HTMLElement>('[data-gn-aside-part="title"]');
        const text = title?.firstElementChild;
        if (!title || !text) throw new Error('Missing title');
        const range = document.createRange();
        range.selectNodeContents(text);
        return (
            node.getBoundingClientRect().width -
            title.getBoundingClientRect().width +
            range.getBoundingClientRect().width
        );
    });
    for (const delta of [-0.25, 0.25, -0.25, 0.25]) {
        await menu.evaluate((node, width) => {
            if (node.parentElement) node.parentElement.style.setProperty('width', `${width}px`);
        }, boundary + delta);
        await expect.poll(() => lines(long)).toBe(delta < 0 ? 2 : 1);
        const heights = await long.evaluate(async (node) => {
            const values = [];
            for (let i = 0; i < 8; i++) {
                await new Promise(requestAnimationFrame);
                values.push(node.getBoundingClientRect().height);
            }
            return values;
        });
        expect(new Set(heights).size).toBe(1);
    }
    await long.evaluate((node) => {
        node.style.setProperty('font-size', '20px');
        node.style.setProperty('line-height', '28px');
    });
    await expect.poll(() => lines(long)).toBe(2);
    expect(await height(long)).toBeGreaterThanOrEqual(64);
    await expectIconAtFirstLine(long);
});

test('automatic title reserves adornments and the group chevron with rich text', async ({
    mount,
    page,
}, testInfo) => {
    await mount(
        <AutomaticTitleExample
            grouped
            quickAccess
            adornment
            title={
                <span>
                    Синтетический <strong>мониторинг</strong>
                </span>
            }
            groupTitle="Группа с очень длинным названием"
        />,
    );
    const menu = page.getByTestId('menu');
    const long = row(menu, 'long');
    const group = menu.getByRole('link', {name: 'Группа с очень длинным названием'});
    await expect.poll(() => lines(group)).toBe(2);
    await expect.poll(() => lines(long)).toBe(2);
    await expectIconAtFirstLine(group);
    await expectIconAtFirstLine(long);
    const textBox = await long.locator('[class*="__title-text"]').boundingBox();
    const badgeBox = await long.getByTestId('badge').boundingBox();
    if (!textBox || !badgeBox) throw new Error('Missing text or badge');
    expect(textBox.x + textBox.width).toBeLessThanOrEqual(badgeBox.x);
    await group.focus();
    await page.keyboard.press('Tab');
    await expect(menu.getByRole('button', {expanded: true})).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(long).toHaveCount(0);
    await menu.getByRole('button', {expanded: false}).focus();
    await page.keyboard.press('Enter');
    await expect(long).toBeVisible();
    await page.screenshot({path: testInfo.outputPath('automatic-title-rich.png')});
});

test('automatic title showcase switches language in the full sidebar', async ({
    mount,
    page,
}, testInfo) => {
    await mount(<AsideHeaderStories.AutomaticTitles />);
    await page.evaluate(() => document.fonts.ready);
    await expect(
        page.getByRole('button', {name: 'Синтетический мониторинг', exact: true}),
    ).toHaveCount(2);
    await page.screenshot({path: testInfo.outputPath('automatic-titles-ru.png')});
    await page.getByRole('button', {name: 'English', exact: true}).click();
    await expect(page.getByRole('button', {name: 'Synthetic monitoring', exact: true})).toHaveCount(
        2,
    );
    await expect(
        page.getByRole('button', {name: 'Notification methods', exact: true}),
    ).toBeVisible();
    await page.screenshot({path: testInfo.outputPath('automatic-titles-en.png')});
});
