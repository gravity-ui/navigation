import React from 'react';

import type {Meta, StoryFn} from '@storybook/react';

import {getAsideHeaderWrapper} from '../../AsideHeader/__stories__/getAsideHeaderWrapper';
import {ActionBar} from '../ActionBar';

import {ActionBarShowcase} from './ActionBarShowcase';
import {ActionBarSingleSection} from './ActionBarSingleSection';

export default {
    title: 'components/ActionBar',
    component: ActionBar,
    args: {
        'aria-label': 'Actions bar',
    },
    decorators: [getAsideHeaderWrapper()],
    parameters: {
        a11y: {
            element: '#storybook-root',
            config: {
                rules: [
                    {
                        id: 'color-contrast',
                        enabled: false,
                    },
                ],
            },
        },
    },
} as Meta<typeof ActionBar>;

const ShowcaseTemplate: StoryFn<typeof ActionBar> = () => <ActionBarShowcase />;
export const Showcase = ShowcaseTemplate.bind({});

const SingleSectionTemplate: StoryFn<typeof ActionBar> = () => <ActionBarSingleSection />;
export const SingleSection = SingleSectionTemplate.bind({});
