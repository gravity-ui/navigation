import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {DrawerShowcase} from './DrawerShowcase';

export default {
    title: 'components/Drawer',
    component: DrawerShowcase,
} as Meta;

const ShowcaseTemplate: Story = () => <DrawerShowcase />;
export const Showcase = ShowcaseTemplate.bind({});
