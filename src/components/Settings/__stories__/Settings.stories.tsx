import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {Settings} from '..';
import {SettingsDemo} from './SettingsDemo';

export default {
    title: 'components/Settings',
    component: Settings,
} as Meta;

const ShowcaseTemplate: Story = () => <SettingsDemo />;
export const Showcase = ShowcaseTemplate.bind({});
