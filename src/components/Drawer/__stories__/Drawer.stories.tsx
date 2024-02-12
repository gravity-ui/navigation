import React from 'react';

import type {Meta, StoryFn} from '@storybook/react';

import {DrawerShowcase} from './DrawerShowcase';

export default {
    title: 'components/Drawer',
    component: DrawerShowcase,
} as Meta;

const ShowcaseTemplate: StoryFn = () => <DrawerShowcase />;
export const Showcase = ShowcaseTemplate.bind({});
