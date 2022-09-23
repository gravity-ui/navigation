import React from 'react';
import {Meta} from '@storybook/react/types-6-0';
import {Story} from '@storybook/react';

import {Logo, LogoProps} from '../Logo';
import logoIcon from '../../../../.storybook/assets/logo.svg';

export default {
    title: 'Components/AsideHeader/Logo',
    id: 'components/Logo',
    argTypes: {
        text: {
            control: {type: 'text'},
            defaultValue: 'Cloud',
        },
        compact: {
            control: {type: 'boolean'},
            defaultValue: false,
        },
        icon: {
            control: {type: 'text'},
            defaultValue: logoIcon,
        },
        iconSrc: {
            control: {type: 'text'},
            defaultValue: undefined,
        },
        iconSize: {
            control: {type: 'number'},
            defaultValue: undefined,
        },
        textSize: {
            control: {type: 'number'},
            defaultValue: 'none',
        },
    },
    component: Logo,
} as Meta;

const Template: Story<LogoProps> = (args) => <Logo {...args} />;

// Reuse that template for creating different stories
export const Default = Template.bind({});
