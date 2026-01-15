import React from 'react';

import {Bell, Gear, Heart, Magnifier, Person, Star} from '@gravity-ui/icons';
import type {Meta, StoryFn} from '@storybook/react';

import {
    ASIDE_HEADER_COLLAPSED_WIDTH,
    ASIDE_HEADER_COLLAPSED_WIDTH_COMPACT_MODE,
    ASIDE_HEADER_EXPANDED_WIDTH,
} from '../../../../constants';
import {AsideHeaderContextProvider} from '../../../AsideHeaderContext';
import {EMPTY_CONTEXT_VALUE} from '../../../__stories__/moc';
import {FooterItem} from '../../FooterItem/FooterItem';
import {FooterBar, FooterBarProps} from '../FooterBar';

import './FooterBarShowcase.scss';

export default {
    title: 'Components/FooterBar',
    component: FooterBar,
    argTypes: {
        isPinned: {
            control: 'boolean',
            description: 'When true, items render horizontally (icon only)',
        },
        isExpanded: {
            control: 'boolean',
            description: 'When true, navigation is expanded (used in vertical mode)',
        },
        isCompactMode: {
            control: 'boolean',
            description: 'When true, uses compact item height (28px)',
        },
        maxVisibleItems: {
            control: 'number',
            description: 'Maximum visible items before showing more button',
        },
    },
    decorators: [
        (DecoratedStory, context) => {
            const {
                args: {isPinned, isExpanded, isCompactMode},
            } = context;
            const collapsedWidth = isCompactMode
                ? ASIDE_HEADER_COLLAPSED_WIDTH_COMPACT_MODE
                : ASIDE_HEADER_COLLAPSED_WIDTH;
            // Width depends on isExpanded: expanded shows full width, collapsed shows icon-only width
            const width = isExpanded ? ASIDE_HEADER_EXPANDED_WIDTH : collapsedWidth;

            return (
                <div style={{width}} className="footer-bar-showcase">
                    <AsideHeaderContextProvider
                        value={{...EMPTY_CONTEXT_VALUE, pinned: isPinned ?? false, size: width}}
                    >
                        <DecoratedStory />
                    </AsideHeaderContextProvider>
                </div>
            );
        },
    ],
} as Meta;

const Template: StoryFn<FooterBarProps> = (args) => <FooterBar {...args} />;

// In horizontal mode (isPinned=true), FooterBar automatically sets layout="horizontal" (hides title)
export const HorizontalPinned = Template.bind({});
HorizontalPinned.args = {
    children: [
        <FooterItem key="search" id="search" title="Search" icon={Magnifier} layout="horizontal" />,
        <FooterItem
            key="favorites"
            id="favorites"
            title="Favorites"
            icon={Star}
            layout="horizontal"
        />,
        <FooterItem key="likes" id="likes" title="Likes" icon={Heart} layout="horizontal" />,
        <FooterItem
            key="notifications"
            id="notifications"
            title="Notifications"
            icon={Bell}
            layout="horizontal"
        />,
        <FooterItem
            key="settings"
            id="settings"
            title="Settings"
            icon={Gear}
            layout="horizontal"
            current
        />,
    ],
    isPinned: true,
    isExpanded: true,
    isCompactMode: false,
};

// In vertical collapsed mode, FooterBar passes isExpanded=false
export const VerticalCollapsed = Template.bind({});
VerticalCollapsed.args = {
    children: [
        <FooterItem key="search" id="search" title="Search" icon={Magnifier} />,
        <FooterItem key="settings" id="settings" title="Settings" icon={Gear} />,
    ],
    isPinned: false,
    isExpanded: false,
    isCompactMode: false,
};

// In vertical expanded mode, FooterBar passes isExpanded=true (shows text)
export const VerticalExpanded = Template.bind({});
VerticalExpanded.args = {
    children: [
        <FooterItem key="search" id="search" title="Search" icon={Magnifier} />,
        <FooterItem key="favorites" id="favorites" title="Favorites" icon={Star} />,
        <FooterItem key="settings" id="settings" title="Settings" icon={Gear} />,
    ],
    isPinned: false,
    isExpanded: true,
    isCompactMode: false,
};

// Horizontal mode with overflow - FooterBar sets layout="horizontal" for visible items
export const HorizontalWithOverflow = Template.bind({});
HorizontalWithOverflow.args = {
    children: [
        <FooterItem key="search" id="search" title="Search" icon={Magnifier} layout="horizontal" />,
        <FooterItem
            key="favorites"
            id="favorites"
            title="Favorites"
            icon={Star}
            layout="horizontal"
        />,
        <FooterItem key="likes" id="likes" title="Likes" icon={Heart} layout="horizontal" />,
        <FooterItem
            key="notifications"
            id="notifications"
            title="Notifications"
            icon={Bell}
            layout="horizontal"
        />,
        <FooterItem
            key="settings"
            id="settings"
            title="Settings"
            icon={Gear}
            layout="horizontal"
        />,
        <FooterItem key="profile" id="profile" title="Profile" icon={Person} layout="horizontal" />,
        <FooterItem key="nav1" id="nav1" title="Nav-item-1" icon={Gear} layout="horizontal" />,
        <FooterItem key="nav2" id="nav2" title="Nav-item-2" icon={Gear} layout="horizontal" />,
    ],
    isPinned: true,
    isExpanded: true,
    isCompactMode: false,
    maxVisibleItems: 5,
};

export const VerticalWithOverflow = Template.bind({});
VerticalWithOverflow.args = {
    children: [
        <FooterItem key="search" id="search" title="Search" icon={Magnifier} />,
        <FooterItem key="favorites" id="favorites" title="Favorites" icon={Star} />,
        <FooterItem key="likes" id="likes" title="Likes" icon={Heart} />,
        <FooterItem key="notifications" id="notifications" title="Notifications" icon={Bell} />,
        <FooterItem key="settings" id="settings" title="Settings" icon={Gear} />,
        <FooterItem key="profile" id="profile" title="Profile" icon={Person} />,
    ],
    isPinned: false,
    isExpanded: true,
    isCompactMode: false,
    maxVisibleItems: 5,
};

// Horizontal mode with renderAfter slot - multiple items + user slot
export const HorizontalWithRenderAfter = Template.bind({});
HorizontalWithRenderAfter.args = {
    children: [
        <FooterItem key="search" id="search" title="Search" icon={Magnifier} layout="horizontal" />,
        <FooterItem
            key="favorites"
            id="favorites"
            title="Favorites"
            icon={Star}
            layout="horizontal"
        />,
        <FooterItem
            key="settings"
            id="settings"
            title="Settings"
            icon={Gear}
            layout="horizontal"
        />,
    ],
    isPinned: true,
    isExpanded: true,
    isCompactMode: false,
    renderAfter: () => (
        <div className="footer-bar-showcase__user">
            <div className="footer-bar-showcase__avatar">
                <Person />
            </div>
            <span className="footer-bar-showcase__username">Account</span>
        </div>
    ),
};

export const VerticalWithRenderAfter = Template.bind({});
VerticalWithRenderAfter.args = {
    children: [<FooterItem key="settings" id="settings" title="Settings" icon={Gear} />],
    isPinned: false,
    isExpanded: false,
    isCompactMode: false,
    renderAfter: () => (
        <div className="footer-bar-showcase__user footer-bar-showcase__user_collapsed">
            <div className="footer-bar-showcase__avatar">
                <Person />
            </div>
        </div>
    ),
};
