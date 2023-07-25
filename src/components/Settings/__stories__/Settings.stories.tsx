import React from 'react';
import type {Meta, StoryFn} from '@storybook/react';

import {Settings} from '..';
import {SettingsDemo} from './SettingsDemo';
import {SettingsMobileDemo} from './SettingsMobileDemo';

export default {
    title: 'components/Settings',
    component: Settings,
} as Meta;

const ShowcaseTemplate: StoryFn = () => <SettingsDemo />;
export const Showcase = ShowcaseTemplate.bind({});

const ShowcaseMobileTemplate: StoryFn = () => <SettingsMobileDemo />;
export const ViewMobile = ShowcaseMobileTemplate.bind({});
