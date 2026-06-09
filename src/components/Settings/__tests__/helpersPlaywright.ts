import {composeStories} from '@storybook/react-webpack5';

import * as DefaultSettingsStories from '../__stories__/Settings.stories';

export const SettingsStories = composeStories(DefaultSettingsStories);
