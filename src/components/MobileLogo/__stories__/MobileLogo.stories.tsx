import React from 'react';

import type {Meta, StoryFn} from '@storybook/react';

import {MobileLogo} from '..';
import type {MobileLogoProps} from '..';

import logoIcon from '../../../../.storybook/assets/logo.svg';

export default {
    title: 'components/MobileLogo',
    component: MobileLogo,
    args: {
        text: 'Service',
        icon: logoIcon,
        href: '#',
        onClick: () => alert('click on logo'),
    },
} as Meta<typeof MobileLogo>;

const ShowcaseTemplate: StoryFn<MobileLogoProps> = (args) => <MobileLogo {...args} />;
export const Showcase = ShowcaseTemplate.bind({});
