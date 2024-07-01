import React from 'react';

import {test} from '~playwright/core';

import {HotkeysPanelStories} from './helpersPlaywright';

test.describe('HotkeysPanel', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<HotkeysPanelStories.Showcase />);

        await expectScreenshot();
    });
});
