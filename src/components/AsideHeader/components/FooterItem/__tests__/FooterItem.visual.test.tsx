import React from 'react';

import {test} from '~playwright/core';

import {FooterItemStories} from './helpersPlaywright';

test.describe('FooterItem', () => {
    test('render story: <Default>', async ({mount, expectScreenshot}) => {
        await mount(<FooterItemStories.Default />);

        await expectScreenshot();
    });
});
