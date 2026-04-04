import {composeStories} from '@storybook/react-webpack5';

import * as DefaultOverlapPanelStories from '../__stories__/OverlapPanel.stories';

export const OverlapPanelStories = composeStories(DefaultOverlapPanelStories);
