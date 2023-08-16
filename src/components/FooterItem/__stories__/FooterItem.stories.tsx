import React from 'react';
import type {Meta, StoryFn} from '@storybook/react';

import {FooterItem, FooterItemProps} from '../FooterItem';
import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../../constants';

import settingsIcon from '../../../../.storybook/assets/settings.svg';

import {AsideHeaderContextProvider} from '../../AsideHeader/AsideHeaderContext';

import './FooterItemShowcase.scss';

export default {
    title: 'Components/AsideHeader/FooterItem',
    component: FooterItem,
    decorators: [
        (DecoratedStory, context) => {
            const {
                args: {compact},
            } = context;
            const width = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;

            return (
                <div style={{width}} className="footer-item-showcase">
                    <AsideHeaderContextProvider value={{compact, size: width}}>
                        <DecoratedStory />
                    </AsideHeaderContextProvider>
                </div>
            );
        },
    ],
} as Meta;

const Template: StoryFn<FooterItemProps> = (args) => <FooterItem {...args} />;

export const Default = Template.bind({});
Default.args = {
    compact: false,
    item: {
        id: 'settings',
        title: 'Settings',
        icon: settingsIcon,
    },
};
