import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import {getAsideHeaderWrapper} from '../../AsideHeader/__stories__/getAsideHeaderWrapper';
import {ActionBar} from '../ActionBar';
import {ActionBarShowcase} from './ActionBarShowcase';

export default {
    title: 'components/ActionBar',
    component: ActionBar,
    args: {
        'aria-label': 'Actions bar',
    },
    decorators: [getAsideHeaderWrapper()],
} as ComponentMeta<typeof ActionBar>;

const ShowcaseTemplate: ComponentStory<typeof ActionBar> = () => <ActionBarShowcase />;
export const Showcase = ShowcaseTemplate.bind({});
