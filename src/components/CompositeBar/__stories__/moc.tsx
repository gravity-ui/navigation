import React from 'react';
import settingsIcon from '../../../../.storybook/assets/settings.svg';
import addIcon from '../../../../.storybook/assets/add.svg';
import {MenuItem} from 'src/components/types';

function renderTag(tag: string) {
    return <div className="composite-bar-showcase__tag">{tag.toUpperCase()}</div>;
}

export const menuItemsShowcase: MenuItem[] = [
    {
        id: 'overview',
        title: 'Overview',
        icon: settingsIcon,
        iconSize: 20,
    },
    {
        id: 'operations',
        title: 'Operations',
        icon: settingsIcon,
        iconSize: 20,
        rightAdornment: renderTag('New'),
        current: true,
    },
    {
        id: 'templates',
        title: 'Main notifications long menu title',
        icon: settingsIcon,
        iconSize: 20,
    },
    {
        id: 'monitoring',
        title: 'Monitoring',
        icon: settingsIcon,
        iconSize: 20,
    },
    {
        id: 'notifications',
        title: 'Main notifications long long long long menu title',
        icon: settingsIcon,
        current: true,
        iconSize: 20,
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: settingsIcon,
        iconSize: 20,
        rightAdornment: renderTag('New'),
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
    },
    {
        id: 'id1',
        title: 'Objects',
        tooltipText: 'Custom tooltip text',
        icon: settingsIcon,
        iconSize: 20,
        pinned: true,
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
        itemWrapper(...[node, , isCollapsed, isCompact]) {
            return !isCollapsed && !isCompact ? (
                <div className="composite-bar-showcase__item-accent aside-header-showcase__item-accent">
                    {node}
                </div>
            ) : (
                node
            );
        },
    },
    {
        id: 'action2',
        title: 'Create smth',
        type: 'action',
        icon: addIcon,
        iconSize: 14,
        afterMoreButton: true,
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
    },
];
