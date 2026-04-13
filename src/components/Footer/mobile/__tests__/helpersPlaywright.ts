import {composeStories} from '@storybook/react-webpack5';

import * as DefaultMobileFooterStories from '../__stories__/MobileFooter.stories';

export const MobileFooterStories = composeStories(DefaultMobileFooterStories);
