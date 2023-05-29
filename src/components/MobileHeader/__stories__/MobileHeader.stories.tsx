import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {MobileHeader} from '..';
import {MobileHeaderShowcase} from './MobileHeaderShowcase';

export default {
    title: 'components/MobileHeader',
    component: MobileHeader,
} as Meta;

const ShowcaseTemplate: Story = () => <MobileHeaderShowcase />;
export const Showcase = ShowcaseTemplate.bind({});
