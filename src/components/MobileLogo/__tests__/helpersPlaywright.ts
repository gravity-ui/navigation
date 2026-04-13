import {composeStories} from '@storybook/react-webpack5';

import * as DefaultMobileLogoStories from '../__stories__/MobileLogo.stories';

export const MobileLogoStories = composeStories(DefaultMobileLogoStories);
