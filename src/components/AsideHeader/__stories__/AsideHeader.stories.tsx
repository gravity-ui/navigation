import React from 'react';

import type {Meta, StoryFn} from '@storybook/react';

import {AsideHeader} from '../AsideHeader';
import {AsideHeaderShowcase} from './AsideHeaderShowcase';
import {PageLayout} from '../components/PageLayout/PageLayout';
import {PageLayoutAside} from '../components/PageLayout/PageLayoutAside';
import logoIcon from '../../../../.storybook/assets/logo.svg';
import {menuItemsShowcase} from './moc';

export default {
    title: 'components/AsideHeader',
    component: AsideHeader,
} as Meta;

const ShowcaseTemplate: StoryFn = (args) => <AsideHeaderShowcase {...args} />;
export const Showcase = ShowcaseTemplate.bind({});

const CompactTemplate: StoryFn = (args) => <AsideHeaderShowcase {...args} />;
export const Compact = CompactTemplate.bind({});
Compact.args = {
    initialCompact: true,
};

const MultipleTooltipTemplate: StoryFn = (args) => <AsideHeaderShowcase {...args} />;
export const MultipleTooltip = MultipleTooltipTemplate.bind({});
MultipleTooltip.args = {
    multipleTooltip: true,
    initialCompact: true,
};

const AdvancedUsageTemplate: StoryFn = (args) => {
    const [compact, setCompact] = React.useState(args.initialCompact);

    return (
        <PageLayout reverse compact={compact}>
            <PageLayout.Content>PageContent</PageLayout.Content>
            <PageLayoutAside
                headerDecoration
                menuItems={menuItemsShowcase}
                logo={{
                    text: 'Service',
                    icon: logoIcon,
                    href: '#',
                    onClick: () => alert('click on logo'),
                }}
                onChangeCompact={setCompact}
                {...args}
            />
        </PageLayout>
    );
};

export const AdvancedUsage = AdvancedUsageTemplate.bind({});

AdvancedUsage.args = {
    multipleTooltip: false,
    initialCompact: true,
};

const TopAlertTemplate: StoryFn = (args) => <AsideHeaderShowcase {...args} />;
export const HeaderAlert = TopAlertTemplate.bind({});
HeaderAlert.args = {
    topAlert: {
        title: 'Maintenance',
        view: 'filled',
        message: 'Scheduled maintenance is being performed',
        actions: [
            {
                text: 'More...',
                handler: () => alert('More information about top alert'),
            },
        ],
    },
};
