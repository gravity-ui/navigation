import {composeStories} from '@storybook/react';

import * as DefaultLogoStories from '../__stories__/Logo.stories';

export const LogoStories = composeStories(DefaultLogoStories);
