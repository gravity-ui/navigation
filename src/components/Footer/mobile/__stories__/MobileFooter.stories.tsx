import React from 'react';

import {Meta, StoryFn} from '@storybook/react-webpack5';

import {MobileFooter} from '..';
import {FooterProps} from '../../types';

import {MobileFooterShowcase} from './MobileFooterShowcase';
import {longMenuItems, menuItems} from './moc';

import logoIcon from '../../../../../.storybook/assets/logo.svg';

export default {
    title: 'components/MobileFooter',
    component: MobileFooter,
    args: {
        withDivider: false,
        menuItems,
        moreButtonTitle: 'Show more',
        copyright: `@ ${new Date().getFullYear()} "My Service"`,
        logo: {
            icon: logoIcon,
            iconSize: 24,
            text: 'My Service',
            'aria-label': 'My Service',
        },
    },
    parameters: {
        a11y: {
            context: '#storybook-root',
            config: {
                rules: [
                    {
                        id: 'color-contrast',
                        enabled: false,
                    },
                    {
                        id: 'aria-required-children',
                        enabled: false,
                        selector: '.g-menu', // https://github.com/gravity-ui/uikit/pull/1548
                    },
                    {
                        id: 'aria-required-parent',
                        enabled: false,
                        selector: '.g-menu__item', // https://github.com/gravity-ui/uikit/pull/1548
                    },
                    {
                        id: 'listitem', // https://github.com/gravity-ui/uikit/pull/1548
                        enabled: false,
                    },
                ],
            },
        },
    },
} as Meta<typeof MobileFooter>;

const ShowcaseTemplate: StoryFn<FooterProps> = (args) => <MobileFooterShowcase {...args} />;
export const Showcase = ShowcaseTemplate.bind({});

const ManyItemsTemplate: StoryFn<FooterProps> = (args) => (
    <MobileFooterShowcase {...args} menuItems={longMenuItems} />
);
export const ManyItems = ManyItemsTemplate.bind({});

const ClearViewTemplate: StoryFn<FooterProps> = (args) => (
    <MobileFooterShowcase {...args} view="clear" />
);

export const ClearView = ClearViewTemplate.bind({});
