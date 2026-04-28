import React from 'react';

import {test} from '~playwright/core';

import {AsideHeaderStories} from './helpersPlaywright';

/** Order matches exports in `@stories__/AsideHeader.stories.tsx`. */
const ASIDE_HEADER_STORY_KEYS = [
    'Showcase',
    'Compact',
    'CustomTheme',
    'CustomBackground',
    'AdvancedUsage',
    'HeaderAlert',
    'HeaderAlertCentered',
    'HeaderAlertCustom',
    'Fallback',
    'LineClamp',
    'CollapseButtonWrapper',
    'MenuGroups',
    'MenuGroupsCompact',
    'MenuGroupsScrollbar',
    'MenuScrollbar',
] as const satisfies ReadonlyArray<keyof typeof AsideHeaderStories>;

test.describe('AsideHeader', () => {
    for (const storyKey of ASIDE_HEADER_STORY_KEYS) {
        test(`render story: <${storyKey}>`, async ({mount, expectScreenshot}) => {
            const Story = AsideHeaderStories[storyKey];
            await mount(<Story />, undefined, {
                width: 1200,
                height: 720,
            });

            await expectScreenshot();
        });
    }
});
