import React from 'react';

import {test} from '~playwright/core';

import {FooterBarStories} from './helpersPlaywright';

test.describe('FooterBar', () => {
    test('render story: <HorizontalPinned>', async ({mount, expectScreenshot}) => {
        await mount(<FooterBarStories.HorizontalPinned />);

        await expectScreenshot();
    });

    test('render story: <VerticalCollapsed>', async ({mount, expectScreenshot}) => {
        await mount(<FooterBarStories.VerticalCollapsed />);

        await expectScreenshot();
    });

    test('render story: <VerticalExpanded>', async ({mount, expectScreenshot}) => {
        await mount(<FooterBarStories.VerticalExpanded />);

        await expectScreenshot();
    });

    test('render story: <HorizontalWithOverflow>', async ({mount, expectScreenshot}) => {
        await mount(<FooterBarStories.HorizontalWithOverflow />);

        await expectScreenshot();
    });

    test('render story: <VerticalWithOverflow>', async ({mount, expectScreenshot}) => {
        await mount(<FooterBarStories.VerticalWithOverflow />);

        await expectScreenshot();
    });

    test('render story: <HorizontalWithRenderAfter>', async ({mount, expectScreenshot}) => {
        await mount(<FooterBarStories.HorizontalWithRenderAfter />);

        await expectScreenshot();
    });

    test('render story: <VerticalWithRenderAfter>', async ({mount, expectScreenshot}) => {
        await mount(<FooterBarStories.VerticalWithRenderAfter />);

        await expectScreenshot();
    });
});
