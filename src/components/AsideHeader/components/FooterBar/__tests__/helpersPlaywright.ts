import {composeStories} from '@storybook/react-webpack5';

import * as DefaultFooterBarStories from '../__stories__/FooterBar.stories';

export const FooterBarStories = composeStories(DefaultFooterBarStories);
