import {composeStories} from '@storybook/react-webpack5';

import * as DefaultAsideHeaderStories from '../__stories__/AsideHeader.stories';

export const AsideHeaderStories = composeStories(DefaultAsideHeaderStories);
