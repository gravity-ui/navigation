/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import {AsideHeaderItem, FooterItem} from '@gravity-ui/navigation';

const headerItems: AsideHeaderItem[] = [
    {
        id: 'home',
        title: 'Home',
        link: '/home',
        current: true,
    },
    {
        id: 'settings',
        title: 'Settings',
        link: '/settings',
        icon: '<svg>...</svg>',
    },
];

const singleItem: AsideHeaderItem = {
    id: 'profile',
    title: 'Profile',
    link: '/profile',
    enableTooltip: true,
};

const footerItems: FooterItem[] = [
    {
        id: 'about',
        title: 'About',
        link: '/about',
    },
    {
        id: 'contact',
        title: 'Contact',
        link: '/contact',
    },
];

const structuralItems = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        link: '/dashboard',
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
