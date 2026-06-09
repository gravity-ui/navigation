import {composeStories} from '@storybook/react-webpack5';

import * as DefaultHotkeysPanelStories from '../__stories__/HotkeysPanel.stories';

export const HotkeysPanelStories = composeStories(DefaultHotkeysPanelStories);
