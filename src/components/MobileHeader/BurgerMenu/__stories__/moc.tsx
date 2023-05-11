import React from 'react';
import settingsIcon from '../../../../../.storybook/assets/settings.svg';
import {MobileMenuItem} from 'src/components/types';

export const mobileMenuItemsShowcase: MobileMenuItem[] = [
    {
        id: 'overview',
        title: 'Overview',
        icon: settingsIcon,
        iconSize: 20,
    },
    {
        id: 'operations',
        title: 'Operations modal',
        icon: settingsIcon,
        iconSize: 20,
    },
    {
        id: 'templates',
        title: 'Main notifications long menu title',
        icon: settingsIcon,
        iconSize: 20,
    },
    {
        id: 'divider',
        title: '-',
        type: 'divider',
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
        icon: settingsIcon,
        iconSize: 20,
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
        itemWrapper(node) {
            return <div className="burger-menu-showcase__item-accent">{node}</div>;
        },
    },
];
