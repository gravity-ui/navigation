import React from 'react';

import type {Meta, StoryFn} from '@storybook/react';

import {DisablePortalShowcase} from './DisablePortal';
import {DrawerShowcase} from './DrawerShowcase';
import {HideVeilShowcase} from './HideVeil';
import {ResizableItemShowcase} from './ResizableItem';
import {UsePortalShowcase} from './UsePortal';

export default {
    title: 'components/Drawer',
    component: DrawerShowcase,
} as Meta;

const ShowcaseTemplate: StoryFn = () => <DrawerShowcase />;
export const Showcase = ShowcaseTemplate.bind({});

const ResizableItemTemplate: StoryFn = () => <ResizableItemShowcase />;
export const ResizableItem = ResizableItemTemplate.bind({});

const DisablePortalTemplate: StoryFn = () => <DisablePortalShowcase />;
export const DisablePortal = DisablePortalTemplate.bind({});

const HideVeilTemplate: StoryFn = () => <HideVeilShowcase />;
export const HideVeil = HideVeilTemplate.bind({});

const UsePortalTemplate: StoryFn = () => <UsePortalShowcase />;
export const UsePortal = UsePortalTemplate.bind({});
