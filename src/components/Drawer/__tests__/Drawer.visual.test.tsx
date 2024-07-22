import React from 'react';

import {test} from '~playwright/core';

import {DrawerStories} from './helpersPlaywright';

test.describe('DrawerStories', () => {
    test('render story: <ResizableItem>', async ({mount, expectScreenshot, defaultDelay}) => {
        await mount(<DrawerStories.ResizableItem />, undefined, {width: 1200, height: 720});

        await defaultDelay();

        await expectScreenshot();
    });

    test('render story: <HideVeil>', async ({mount, expectScreenshot, defaultDelay}) => {
        await mount(<DrawerStories.HideVeil />, undefined, {width: 1200, height: 720});

        await defaultDelay();

        await expectScreenshot();
    });

    test('render story: <DisablePortal>', async ({mount, expectScreenshot, defaultDelay}) => {
        await mount(<DrawerStories.DisablePortal />, undefined, {width: 1200, height: 720});

        await defaultDelay();

        await expectScreenshot();
    });

    test('render story: <Showcase>', async ({mount, expectScreenshot, defaultDelay}) => {
        await mount(<DrawerStories.Showcase />, undefined, {width: 1200, height: 720});

        await defaultDelay();

        await expectScreenshot();
    });
});
