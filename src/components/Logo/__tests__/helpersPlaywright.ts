import {composeStories} from '@storybook/react-webpack5';

import * as DefaultLogoStories from '../__stories__/Logo.stories';

export const LogoStories = composeStories(DefaultLogoStories);
