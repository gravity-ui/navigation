import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {AsideHeader} from '../AsideHeader';
import {AsideHeaderShowcase} from './AsideHeaderShowcase';

export default {
    title: 'components/AsideHeader',
    component: AsideHeader,
} as Meta;

const ShowcaseTemplate: Story = () => <AsideHeaderShowcase />;
export const Showcase = ShowcaseTemplate.bind({});
