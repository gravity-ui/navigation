import React from 'react';

import type {Meta, StoryFn} from '@storybook/react-webpack5';

import {MobileHeader} from '..';

import {MobileHeaderShowcase} from './MobileHeaderShowcase';

export default {
    title: 'components/MobileHeader',
    component: MobileHeader,
} as Meta;

const ShowcaseTemplate: StoryFn = () => <MobileHeaderShowcase />;
export const Showcase = ShowcaseTemplate.bind({});
