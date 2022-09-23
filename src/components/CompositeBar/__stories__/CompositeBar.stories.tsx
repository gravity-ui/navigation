import React from 'react';
import {Meta} from '@storybook/react/types-6-0';
import {Story} from '@storybook/react';

import {CompositeBar, CompositeBarProps} from '../CompositeBar';
import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../../constants';
import settingsIcon from '../../../../assets/icons/settings.svg';
import addIcon from '../../../../assets/icons/add.svg';

import './CompositeBarShowcase.scss';

export default {
    title: 'Components/AsideHeader/CompositeBar',
    component: CompositeBar,
    decorators: [
        (DecoratedStory, context) => {
            const {
                args: {compact},
            } = context;
            const width = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;

            return (
                <div style={{width}}>
                    <DecoratedStory />
                </div>
            );
        },
    ],
} as Meta;

const Template: Story<CompositeBarProps> = (args) => (
    <div className="composite-bar-showcase">
        <CompositeBar {...args} />
    </div>
);

function renderTag(tag: string) {
    return <div className="composite-bar-showcase__tag">{tag.toUpperCase()}</div>;
}

export const Default = Template.bind({});
Default.args = {
    compact: false,
    items: [
        {
            id: 'overview',
            title: 'Overview',
            icon: settingsIcon,
            iconSize: 20,
        },
        {
            id: 'operations',
            title: 'Operations',
            icon: settingsIcon,
            iconSize: 20,
            rightAdornment: renderTag('New'),
            current: true,
        },
        {
            id: 'templates',
            title: 'Main notifications long menu title',
            icon: settingsIcon,
            iconSize: 20,
        },
        {
            id: 'monitoring',
            title: 'Monitoring',
            icon: settingsIcon,
            iconSize: 20,
        },
        {
            id: 'action2',
            title: 'Create smth',
            type: 'action',
            icon: addIcon,
            iconSize: 14,
            afterMoreButton: true,
        },
        {
            id: 'notifications',
            title: 'Main notifications long long long long menu title',
            icon: settingsIcon,
            current: true,
            iconSize: 20,
        },
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: settingsIcon,
            iconSize: 20,
            rightAdornment: renderTag('New'),
        },
    ],
};
