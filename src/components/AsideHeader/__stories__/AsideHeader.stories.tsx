import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {AsideHeader} from '../AsideHeader';
import {AsideHeaderShowcase} from './AsideHeaderShowcase';

export default {
    title: 'components/AsideHeader',
    component: AsideHeader,
} as Meta;

const ShowcaseTemplate: Story = (args) => <AsideHeaderShowcase {...args} />;
export const Showcase = ShowcaseTemplate.bind({});

const CompactTemplate: Story = (args) => <AsideHeaderShowcase {...args} />;
export const Compact = CompactTemplate.bind({});
Compact.args = {
    initialCompact: true,
};

const SingleTooltipsTemplate: Story = (args) => <AsideHeaderShowcase {...args} />;
export const SingleTooltips = SingleTooltipsTemplate.bind({});
SingleTooltips.args = {
    multipleTooltip: false,
    initialCompact: true,
};
