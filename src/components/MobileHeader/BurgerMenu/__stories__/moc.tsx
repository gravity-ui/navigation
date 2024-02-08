import React from 'react';

import {Gear} from '@gravity-ui/icons';

import {MobileMenuItem} from '../../types';

export const mobileMenuItemsShowcase: MobileMenuItem[] = [
    {
        id: 'overview',
        title: 'Overview',
        icon: Gear,
        iconSize: 20,
    },
    {
        id: 'operations',
        title: 'Operations modal',
        icon: Gear,
        iconSize: 20,
    },
    {
        id: 'templates',
        title: 'Main notifications long menu title',
        icon: Gear,
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
        icon: Gear,
        current: true,
        iconSize: 20,
        onItemClick(item) {
            alert(JSON.stringify(item));
        },
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: Gear,

        onItemClick(item) {
            alert(JSON.stringify(item));
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
        icon: Gear,
        iconSize: 20,
        onItemClick(item) {
            alert(JSON.stringify(item));
        },
        itemWrapper(node) {
            return <div className="burger-menu-showcase__item-accent">{node}</div>;
        },
    },
];
