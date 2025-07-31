import React from 'react';

import {Gear} from '@gravity-ui/icons';
import type {Meta, StoryFn} from '@storybook/react';

import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../../../../constants';
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
                args: {compact},
            } = context;
            const width = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;

            return (
                <div style={{width}} className="footer-item-showcase">
                    <AsideHeaderContextProvider
                        value={{...EMPTY_CONTEXT_VALUE, compact, size: width}}
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
    compact: false,
    item: {
        id: 'settings',
        title: 'Settings',
        icon: Gear,
    },
};
