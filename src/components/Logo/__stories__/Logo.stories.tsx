import React from 'react';

import type {Meta, StoryFn} from '@storybook/react';

import {Logo} from '..';
import type {LogoProps} from '../../types';

import logoIcon from '../../../../.storybook/assets/logo.svg';

export default {
    title: 'components/Logo',
    component: Logo,
    args: {
        text: 'Service',
        icon: logoIcon,
        href: '#',
        onClick: () => alert('click on logo'),
        'aria-label': 'Service',
    },
} as Meta<typeof Logo>;

const ShowcaseTemplate: StoryFn<LogoProps> = (args) => <Logo {...args} />;
export const Showcase = ShowcaseTemplate.bind({});
