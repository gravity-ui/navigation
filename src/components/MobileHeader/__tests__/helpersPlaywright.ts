import {composeStories} from '@storybook/react-webpack5';

import * as DefaultMobileHeaderStories from '../__stories__/MobileHeader.stories';

export const MobileHeaderStories = composeStories(DefaultMobileHeaderStories);
