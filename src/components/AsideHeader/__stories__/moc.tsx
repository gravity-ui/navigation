import React from 'react';

import {Gear, Plus} from '@gravity-ui/icons';

import {ASIDE_HEADER_EXPANDED_WIDTH} from '../../constants';
import {AsideHeaderContextType} from '../AsideHeaderContext';
import {AsideHeaderProps} from '../types';

import logoIcon from '../../../../.storybook/assets/logo.svg';

function renderTag(tag: string) {
    return <div className="composite-bar-showcase__tag">{tag.toUpperCase()}</div>;
}

export const EMPTY_CONTEXT_VALUE: AsideHeaderContextType = {
    size: ASIDE_HEADER_EXPANDED_WIDTH,
    compact: true,
};

export const menuItemsShowcase: AsideHeaderProps['menuItems'] = [
    {
        id: 'overview',
        title: 'Overview',
        icon: Gear,
        qa: 'menu-item-gear',
        iconQa: 'menu-item-icon-gear',
    },
    {
        id: 'operations',
        title: 'Operations',
        icon: Gear,
        rightAdornment: renderTag('New'),
    },
    {
        id: 'templates',
        title: 'Main notifications long menu title',
        icon: Gear,
    },
    {
        id: 'divider',
        title: '-',
        type: 'divider',
    },
    {
        id: 'notifications',
        title: 'Main notifications long long long long menu title',
        icon: Gear,
        current: true,
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: Gear,
        rightAdornment: renderTag('New'),
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
    },
    {
        id: 'divider2',
        title: '-',
        type: 'divider',
    },
    {
        id: 'id1',
        title: 'Objects',
        tooltipText: 'Custom tooltip text',
        icon: Gear,
        pinned: true,
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
        itemWrapper(params, makeItem, {collapsed, compact}) {
            return !collapsed && !compact ? (
                <div className="composite-bar-showcase__item-accent aside-header-showcase__item-accent">
                    {makeItem(params)}
                </div>
            ) : (
                makeItem(params)
            );
        },
    },
    {
        id: 'action2',
        title: 'Create smth',
        type: 'action',
        icon: Plus,
        afterMoreButton: true,
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
    },
];

export const text = `
Did you attend? He sang by grove ripe -
The bard of love, the singer of his mourning.
When fields were silent by the early morning,
To sad and simple sounds of a pipe
Did you attend?

Did you behold in dark of forest leaf
The bard of love, the singer of his sadness?
The trace of tears, the smile, the utter paleness,
The quiet look, full of eternal grief,
Did you behold?

Then did you sigh when hearing how cries
The bard of love, the singer of his dole?
When in the woods you saw the young man, sole,
And met the look of his extinguished eyes,
Then did you sigh?
`;

const MENU_ITEMS_CLAMPED_TITLE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

const MENU_ITEMS_CLAMPED: AsideHeaderProps['menuItems'] = [
    {
        id: 'text',
        title: MENU_ITEMS_CLAMPED_TITLE,
        icon: Gear,
    },
    {
        id: 'text-action',
        title: MENU_ITEMS_CLAMPED_TITLE,
        icon: Gear,
        type: 'action',
    },
    {
        id: 'text-link',
        title: MENU_ITEMS_CLAMPED_TITLE,
        icon: Gear,
        link: 'about:blank',
    },
    {
        id: 'text-link-action',
        title: MENU_ITEMS_CLAMPED_TITLE,
        icon: Gear,
        link: 'about:blank',
        type: 'action',
    },
];

export const DEFAULT_LOGO = {
    text: 'Service',
    icon: logoIcon,
    href: '#',
    onClick: () => alert('click on logo'),
    'aria-label': 'Service',
};

export const menuItemsClamped = MENU_ITEMS_CLAMPED.concat({
    id: 'divider',
    title: undefined,
    type: 'divider',
}).concat(
    MENU_ITEMS_CLAMPED.map((item) => ({
        ...item,
        id: item.id.concat('-new'),
        rightAdornment: renderTag('new'),
    })),
);

export const menuItemsWithGroups: AsideHeaderProps['menuItems'] = [
    {
        id: 'overview',
        title: 'Overview',
        icon: Gear,
        groupId: 'main',
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: Gear,
        groupId: 'main',
        current: true,
    },
    {
        id: 'divider1',
        title: '-',
        type: 'divider',
    },
    {
        id: 'settings',
        title: 'Settings',
        icon: Gear,
        groupId: 'admin',
    },
    {
        id: 'users',
        title: 'Users',
        icon: Gear,
        groupId: 'admin',
    },
    {
        id: 'divider2',
        title: '-',
        type: 'divider',
    },
    {
        id: 'help',
        title: 'Help',
        icon: Gear,
        groupId: 'support',
    },
    {
        id: 'feedback',
        title: 'Feedback',
        icon: Gear,
        groupId: 'support',
    },
];

export const menuGroups: AsideHeaderProps['menuGroups'] = [
    {
        id: 'main',
        title: 'Main',
        order: 1,
    },
    {
        id: 'admin',
        title: 'Administration',
        order: 2,
    },
    {
        id: 'support',
        title: 'Support',
        order: 3,
    },
];

// Groups with icons and collapsible behavior
export const menuGroupsWithIcons: AsideHeaderProps['menuGroups'] = [
    {
        id: 'main',
        title: 'Main',
        icon: Gear,
        order: 1,
        collapsible: true,
        collapsedByDefault: false,
    },
    {
        id: 'admin',
        title: 'Administration',
        icon: Gear,
        order: 2,
        collapsible: true,
        collapsedByDefault: true,
    },
    {
        id: 'support',
        title: 'Support',
        icon: Gear,
        order: 3,
        collapsible: true,
        collapsedByDefault: false,
    },
];
