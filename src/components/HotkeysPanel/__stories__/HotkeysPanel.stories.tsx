import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {HotkeysPanel} from '..';
import {HotkeysPanelShowcase} from './HotkeysPanelShowcase';

export default {
    title: 'components/HotkeysPanel',
    component: HotkeysPanel,
} as Meta;

const ShowcaseTemplate: Story = () => <HotkeysPanelShowcase />;
export const Showcase = ShowcaseTemplate.bind({});
