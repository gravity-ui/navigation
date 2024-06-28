import React from 'react';

import {test} from '~playwright/core';

import {BurgerMenuStories} from './helpersPlaywright';

test.describe('BurgerMenu', () => {
    test('render story: <Showcase>', async ({mount, expectScreenshot}) => {
        await mount(<BurgerMenuStories.Showcase />);

        await expectScreenshot();
    });
});
