import React from 'react';

import {Meta, StoryFn} from '@storybook/react';

import {Footer} from '..';
import {FooterProps} from '../../types';

import {FooterShowcase} from './FooterShowcase';
import {longMenuItems, menuItems} from './moc';

import logoIcon from '../../../../../.storybook/assets/logo.svg';

export default {
    title: 'components/Footer',
    component: Footer,
    args: {
        withDivider: false,
        menuItems: menuItems,
        moreButtonTitle: 'Show more',
        copyright: `@ ${new Date().getFullYear()} "My Service"`,
        logo: {
            icon: logoIcon,
            iconSize: 24,
            text: 'My Service',
        },
    },
} as Meta<typeof Footer>;

const ShowcaseTemplate: StoryFn<FooterProps> = (args) => <FooterShowcase {...args} />;
export const Showcase = ShowcaseTemplate.bind({});

const ManyItemsTemplate: StoryFn<FooterProps> = (args) => (
    <FooterShowcase {...args} menuItems={longMenuItems} />
);
export const ManyItems = ManyItemsTemplate.bind({});

const ClearViewTemplate: StoryFn<FooterProps> = (args) => <FooterShowcase {...args} view="clear" />;

export const ClearView = ClearViewTemplate.bind({});
