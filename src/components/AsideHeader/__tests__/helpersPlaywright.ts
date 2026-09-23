import {composeStories} from '@storybook/react-webpack5';

import * as DefaultAsideHeaderStories from '../__stories__/AsideHeader.stories';
import * as DefaultAsideHeaderExamplesStories from '../__stories__/AsideHeaderFullNavigation.stories';

export const AsideHeaderStories = composeStories(DefaultAsideHeaderStories);
export const AsideHeaderExamplesStories = composeStories(DefaultAsideHeaderExamplesStories);
