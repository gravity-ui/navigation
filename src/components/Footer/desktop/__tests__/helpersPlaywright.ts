import {composeStories} from '@storybook/react-webpack5';

import * as DefaultFooterStories from '../__stories__/Footer.stories';

export const FooterStories = composeStories(DefaultFooterStories);
