import React from 'react';
import type {Meta, StoryFn} from '@storybook/react';

import {HotkeysPanel} from '..';
import {HotkeysPanelShowcase} from './HotkeysPanelShowcase';

export default {
    title: 'components/HotkeysPanel',
    component: HotkeysPanel,
} as Meta;

const ShowcaseTemplate: StoryFn = () => <HotkeysPanelShowcase />;
export const Showcase = ShowcaseTemplate.bind({});
