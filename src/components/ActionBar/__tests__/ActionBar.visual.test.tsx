/* Playwright queries are page-scoped, not Testing Library render queries. */
/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';

import {Breadcrumbs, BreadcrumbsItem, Button} from '@gravity-ui/uikit';
import {expect} from '@playwright/experimental-ct-react';
import type {Locator} from '@playwright/test';

import {test} from '~playwright/core';

import {ActionBar} from '../ActionBar';
import {ActionBarGroup} from '../Group/ActionBarGroup';
import {ActionBarItem} from '../Item/ActionBarItem';
import {ActionBarSection} from '../Section/ActionBarSection';

import {ActionBarStories} from './helpersPlaywright';

// Lists controls of different items that overlap and controls whose center is covered by something
// else. Controls that stick out of a too narrow bar (how it overflowed before uikit 8) are fine.
const findOverlaps = (bar: Locator) =>
    bar.evaluate((root) => {
        const CONTROL = 'button, a, [role="button"], [role="link"]';
        const name = (el: Element) => el.getAttribute('aria-label') || el.textContent?.trim();
        const controls = Array.from(root.querySelectorAll(CONTROL))
            .filter((el) => !el.parentElement?.closest(CONTROL))
            .map((el) => ({
                el,
                rect: el.getBoundingClientRect(),
                item: el.closest('[role="menuitem"]'),
            }))
            .filter(({rect}) => rect.width > 0 && rect.height > 0);
        const problems: string[] = [];
        controls.forEach((a, index) => {
            for (const b of controls.slice(index + 1)) {
                const width =
                    Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left);
                const height =
                    Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
                if (a.item !== b.item && width > 0.5 && height > 0.5) {
                    problems.push(`${name(a.el)} overlaps ${name(b.el)} by ${Math.round(width)}px`);
                }
            }
            const x = a.rect.left + a.rect.width / 2;
            // A center past the viewport edge can't be hit-tested.
            if (x < document.documentElement.clientWidth) {
                const hit = document.elementFromPoint(x, a.rect.top + a.rect.height / 2);
                if (!hit || !a.el.contains(hit)) {
                    const target = hit?.closest(CONTROL);
                    problems.push(
                        `a click on ${name(a.el)} lands on ${target ? name(target) : hit?.tagName}`,
                    );
                }
            }
        });
        return problems;
    });

const breadcrumbsItem = () => (
    <ActionBarItem pull="left-grow">
        <Breadcrumbs showRoot onAction={() => {}}>
            <BreadcrumbsItem key="0">Projects</BreadcrumbsItem>
            <BreadcrumbsItem key="1">@gravity-ui</BreadcrumbsItem>
            <BreadcrumbsItem key="2">navigation</BreadcrumbsItem>
            <BreadcrumbsItem key="3">ActionBar</BreadcrumbsItem>
        </Breadcrumbs>
    </ActionBarItem>
);

const rightActionGroup = () => (
    <ActionBarGroup pull="right">
        <ActionBarItem>
            <Button>Right action</Button>
        </ActionBarItem>
    </ActionBarGroup>
);

const LONG_LABEL = 'A very long grow item button label that does not collapse';

// Layouts that do not fit into a 400px viewport, each also checked with Breadcrumbs added.
const narrowLayouts: Record<string, (withBreadcrumbs: boolean) => JSX.Element> = {
    'a stretch group of buttons': (withBreadcrumbs) => (
        <ActionBar aria-label="Actions bar">
            <ActionBarSection type="primary">
                <ActionBarGroup stretchContainer>
                    {withBreadcrumbs && breadcrumbsItem()}
                    <ActionBarItem>
                        <Button view="flat">Long action label number one</Button>
                    </ActionBarItem>
                    <ActionBarItem>
                        <Button view="flat">Long action label number two</Button>
                    </ActionBarItem>
                    <ActionBarItem>
                        <Button view="flat">Long action label number three</Button>
                    </ActionBarItem>
                </ActionBarGroup>
                {rightActionGroup()}
            </ActionBarSection>
        </ActionBar>
    ),
    'a long grow item': (withBreadcrumbs) => (
        <ActionBar aria-label="Actions bar">
            <ActionBarSection type="primary">
                <ActionBarGroup stretchContainer>
                    {withBreadcrumbs && breadcrumbsItem()}
                    <ActionBarItem pull="left-grow">
                        <Button view="flat">{LONG_LABEL}</Button>
                    </ActionBarItem>
                    <ActionBarItem>
                        <Button>Next</Button>
                    </ActionBarItem>
                </ActionBarGroup>
                {rightActionGroup()}
            </ActionBarSection>
        </ActionBar>
    ),
    'a primary section before a secondary one': (withBreadcrumbs) => (
        <ActionBar aria-label="Actions bar">
            <ActionBarSection type="primary">
                <ActionBarGroup>
                    <ActionBarItem>
                        <Button view="flat">Create resource</Button>
                    </ActionBarItem>
                    <ActionBarItem>
                        <Button view="flat">Import data</Button>
                    </ActionBarItem>
                    <ActionBarItem>
                        <Button view="flat">Export report</Button>
                    </ActionBarItem>
                </ActionBarGroup>
                {withBreadcrumbs && (
                    <ActionBarGroup stretchContainer>{breadcrumbsItem()}</ActionBarGroup>
                )}
            </ActionBarSection>
            <ActionBarSection type="secondary">
                <ActionBarGroup>
                    <ActionBarItem>
                        <Button>Secondary</Button>
                    </ActionBarItem>
                </ActionBarGroup>
            </ActionBarSection>
        </ActionBar>
    ),
};

test.describe('ActionBar', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<ActionBarStories.Showcase />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <SingleSection>', async ({mount, expectScreenshot}) => {
        await mount(<ActionBarStories.SingleSection />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('render story: <StretchGroup>', async ({mount, expectScreenshot}) => {
        await mount(<ActionBarStories.StretchGroup />, undefined, {
            padding: 20,
            width: 1200,
            height: 720,
        });

        await expectScreenshot();
    });

    test('collapses breadcrumbs when narrowed and restores them when widened', async ({
        mount,
        page,
    }) => {
        await page.setViewportSize({width: 1200, height: 720});
        // No fixed width: the bar has to follow the viewport.
        await mount(<ActionBarStories.Showcase />, undefined, {padding: 20});

        const bar = page.getByRole('region', {name: 'Actions bar'});
        const breadcrumbs = bar.locator('.g-breadcrumbs');
        const showMore = breadcrumbs.getByRole('button');
        const rightGroup = bar.getByRole('group').last();
        const rightGroupOverflow = async () => {
            const [barBox, groupBox] = await Promise.all([
                bar.boundingBox(),
                rightGroup.boundingBox(),
            ]);
            if (!barBox || !groupBox) throw new Error('Missing action bar geometry');
            return groupBox.x + groupBox.width - (barBox.x + barBox.width);
        };
        const expectExpanded = async () => {
            await expect(breadcrumbs.getByRole('link')).toHaveText([
                'Projects',
                '@gravity-ui',
                'navigation',
            ]);
            await expect(showMore).toHaveCount(0);
        };

        await expectExpanded();

        // At 480px the collapsed breadcrumbs still fit into the bar.
        await page.setViewportSize({width: 480, height: 720});
        await expect.poll(rightGroupOverflow).toBeLessThanOrEqual(0.5);
        await expect(showMore).toBeVisible();

        await page.setViewportSize({width: 1200, height: 720});
        await expectExpanded();
    });

    for (const [layout, render] of Object.entries(narrowLayouts)) {
        for (const withBreadcrumbs of [false, true]) {
            test(`keeps ${layout}${withBreadcrumbs ? ' with breadcrumbs' : ''} clickable when it does not fit`, async ({
                mount,
                page,
            }) => {
                await page.setViewportSize({width: 400, height: 720});
                await mount(render(withBreadcrumbs), undefined, {padding: 20});
                await page.evaluate(() => document.fonts.ready);

                await expect.poll(() => findOverlaps(page.getByRole('region'))).toEqual([]);
            });
        }
    }

    test('keeps a grow item inside a fixed-width group', async ({mount, page}) => {
        await page.setViewportSize({width: 1200, height: 720});
        await mount(
            <ActionBar aria-label="Actions bar">
                <ActionBarSection type="primary">
                    <ActionBarGroup style={{width: 250}}>
                        <ActionBarItem pull="left-grow">
                            <Button view="flat">{LONG_LABEL}</Button>
                        </ActionBarItem>
                        <ActionBarItem>
                            <Button>Next</Button>
                        </ActionBarItem>
                    </ActionBarGroup>
                    {rightActionGroup()}
                </ActionBarSection>
            </ActionBar>,
            undefined,
            {padding: 20},
        );
        await page.evaluate(() => document.fonts.ready);

        await expect.poll(() => findOverlaps(page.getByRole('region'))).toEqual([]);
    });
});
