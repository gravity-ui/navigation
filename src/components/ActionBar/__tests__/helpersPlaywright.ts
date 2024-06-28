import {composeStories} from '@storybook/react';

import * as DefaultActionBarStories from '../__stories__/ActionBar.stories';

const stories = composeStories(DefaultActionBarStories);

type ActionBarStoriesType = typeof stories;

export const ActionBarStories: ActionBarStoriesType = stories;
