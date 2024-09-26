import React from 'react';

import type {Meta, StoryFn} from '@storybook/react';

import {HotkeysPanel} from '..';

import {HotkeysPanelShowcase} from './HotkeysPanelShowcase';

export default {
    title: 'components/HotkeysPanel',
    component: HotkeysPanel,
    parameters: {
        a11y: {
            element: '#storybook-root',
            config: {
                rules: [
                    {
                        id: 'aria-allowed-attr', // https://github.com/gravity-ui/uikit/issues/1336
                        enabled: false,
                    },
                    {
                        id: 'scrollable-region-focusable', // https://github.com/gravity-ui/uikit/issues/1549
                        enabled: false,
                    },
                ],
            },
        },
    },
} as Meta;

const ShowcaseTemplate: StoryFn = () => <HotkeysPanelShowcase />;
export const Showcase = ShowcaseTemplate.bind({});

const WithoutFilterTemplate: StoryFn = () => <HotkeysPanelShowcase filterable={false} />;
export const WithoutFilter = WithoutFilterTemplate.bind({});
