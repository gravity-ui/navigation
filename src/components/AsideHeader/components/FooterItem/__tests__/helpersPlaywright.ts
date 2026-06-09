import {composeStories} from '@storybook/react-webpack5';

import * as DefaultFooterItemStories from '../__stories__/FooterItem.stories';

export const FooterItemStories = composeStories(DefaultFooterItemStories);
