import React from 'react';

import {test} from '~playwright/core';

import {OverlapPanelStories} from './helpersPlaywright';

test.describe('OverlapPanel', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot, defaultDelay}) => {
        await mount(<OverlapPanelStories.Showcase />, undefined, {
            padding: 0,
            width: '100%',
            height: '100%',
        });
        await defaultDelay();
        await expectScreenshot();
    });
});
