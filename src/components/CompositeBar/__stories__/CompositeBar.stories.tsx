import React from 'react';

import type {Meta, StoryFn} from '@storybook/react';

import {CompositeBar, CompositeBarProps} from '../CompositeBar';
import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../../constants';
import {menuItemsShowcase} from './moc';

import './CompositeBarShowcase.scss';
import {AsideHeaderContextProvider} from '../../AsideHeader/AsideHeader';

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

const Template: StoryFn<CompositeBarProps> = (args) => (
    <div className="composite-bar-showcase">
        <AsideHeaderContextProvider value={{compact: false, size: ASIDE_HEADER_EXPANDED_WIDTH}}>
            <CompositeBar {...args} />
        </AsideHeaderContextProvider>
    </div>
);

export const Default = Template.bind({});
Default.args = {
    items: menuItemsShowcase,
};
