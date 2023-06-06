import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {Settings} from '..';
import {SettingsDemo} from './SettingsDemo';
import {SettingsMobileDemo} from './SettingsMobileDemo';

export default {
    title: 'components/Settings',
    component: Settings,
} as Meta;

const ShowcaseTemplate: Story = () => <SettingsDemo />;
export const Showcase = ShowcaseTemplate.bind({});

const ShowcaseMobileTemplate: Story = () => <SettingsMobileDemo />;
export const ViewMobile = ShowcaseMobileTemplate.bind({});
