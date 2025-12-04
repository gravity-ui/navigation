/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import {AsideHeaderItem, FooterItem} from '@gravity-ui/navigation';

const headerItems: AsideHeaderItem[] = [
    {
        id: 'home',
        title: 'Home',
        href: '/home',
        current: true,
    },
    {
        id: 'settings',
        title: 'Settings',
        href: '/settings',
        icon: '<svg>...</svg>',
    },
];

const singleItem: AsideHeaderItem = {
    id: 'profile',
    title: 'Profile',
    href: '/profile',
    enableTooltip: true,
};

const footerItems: FooterItem[] = [
    {
        id: 'about',
        title: 'About',
        href: '/about',
    },
    {
        id: 'contact',
        title: 'Contact',
        href: '/contact',
    },
];

const structuralItems = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        href: '/dashboard',
        compact: true,
        enableTooltip: false,
        onItemClick: () => {},
        bringForward: true,
    },
];

function processItem(item: AsideHeaderItem) {
    console.log(item.link);
    return item.link;
}

const regularObject = {
    link: '/should-not-change',
    notTargetObject: true,
};

interface CustomAsideHeaderItem extends AsideHeaderItem {
    customProp: string;
}

interface CustomFooterItem extends FooterItem {
    additionalData: any;
}
