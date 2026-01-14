import React from 'react';

import {Gear} from '@gravity-ui/icons';
import type {Meta, StoryFn} from '@storybook/react';

import {ASIDE_HEADER_COLLAPSED_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../../../../constants';
import {AsideHeaderContextProvider} from '../../../AsideHeaderContext';
import {EMPTY_CONTEXT_VALUE} from '../../../__stories__/moc';
import {FooterItem, FooterItemProps} from '../FooterItem';

import './FooterItemShowcase.scss';

export default {
    title: 'Components/FooterItem',
    component: FooterItem,
    decorators: [
        (DecoratedStory, context) => {
            const {
                args: {isExpanded},
            } = context;
            const width = isExpanded ? ASIDE_HEADER_EXPANDED_WIDTH : ASIDE_HEADER_COLLAPSED_WIDTH;

            return (
                <div style={{width}} className="footer-item-showcase">
                    <AsideHeaderContextProvider
                        value={{...EMPTY_CONTEXT_VALUE, pinned: isExpanded ?? false, size: width}}
                    >
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
    isExpanded: true,
    id: 'settings',
    title: 'Settings',
    icon: Gear,
};
