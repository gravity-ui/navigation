import React from 'react';

import type {Meta, StoryFn} from '@storybook/react';

import {Settings} from '..';

import {SettingsDemo} from './SettingsDemo';
import {SettingsMobileDemo} from './SettingsMobileDemo';
import {SettingsOverflowDemo} from './SettingsOverflowDemo';

export default {
    title: 'components/Settings',
    component: Settings,
    parameters: {
        a11y: {
            element: '#storybook-root',
            config: {
                rules: [
                    {
                        id: 'color-contrast',
                        enabled: false,
                    },
                    {
                        id: 'heading-order', // not relevant in stories
                        enabled: false,
                    },
                ],
            },
        },
    },
} as Meta;

const ShowcaseTemplate: StoryFn = () => <SettingsDemo />;
export const Showcase = ShowcaseTemplate.bind({});

const ShowcaseMobileTemplate: StoryFn = () => <SettingsMobileDemo />;
export const ViewMobile = ShowcaseMobileTemplate.bind({});

const OverflowTemplate: StoryFn = () => <SettingsOverflowDemo />;
export const Overflow = OverflowTemplate.bind({});
