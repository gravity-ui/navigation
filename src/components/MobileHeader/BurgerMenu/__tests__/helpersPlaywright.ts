import {composeStories} from '@storybook/react-webpack5';

import * as DefaultBurgerMenuStories from '../__stories__/BurgerMenu.stories';

export const BurgerMenuStories = composeStories(DefaultBurgerMenuStories);
