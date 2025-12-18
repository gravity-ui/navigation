/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import {CompositeBarItem, SubheaderMenuItem, FooterItem} from '@gravity-ui/navigation';

const oldSubheaderItems: SubheaderMenuItem[] = [
    {
        item: {
            id: 'home',
            title: 'Home',
            link: '/home',
        },
        compact: true,
        order: 1
    },
    {
        item: {
            id: 'settings',
            title: 'Settings',
            link: '/settings',
        },
        compact: false,
        order: 2
    },
];

const oldCompositeItems: CompositeBarItem[] = [
    {
        item: {
            id: 'dashboard',
            title: 'Dashboard',
            link: '/dashboard',
        },
        compact: true,
    },
];

const nestedAsideItems: AsideHeaderItem[] = [
    {
        item: {
            id: 'profile',
            title: 'Profile',
            link: '/profile',
            current: true,
        },
        compact: false,
        order: 1
    },
    {
        item: {
            id: 'notifications',
            title: 'Notifications',
            link: '/notifications',
        },
        compact: false,
        order: 2
    },
];

const nestedFooterItems: FooterItem[] = [
    {
        item: {
            id: 'about',
            title: 'About',
            link: '/about',
        },
        compact: false,
        order: 10
    },
    {
        item: {
            id: 'contact',
            title: 'Contact',
            link: '/contact',
        },
        compact: false,
        order: 11
    },
];

function processHeaderItem(headerItem: AsideHeaderItem) {
    console.log(headerItem.item.title);
    return headerItem.item.link;
}

function processFooterItem(footerItem: FooterItem) {
    console.log(footerItem.item.title);
    return footerItem.item.link;
}

const structuralItem = {
    item: {
        id: 'docs',
        title: 'Documentation',
        link: '/docs',
    },
    compact: false,
    order: 5
};

const differentStructure = {
    item: {
        id: 'test',
        notTargetProperty: true,
    },
    differentProp: 'value',
};

interface CustomSubheaderItem extends SubheaderMenuItem {
    customProp: string;
}

interface CustomCompositeItem extends CompositeBarItem {
    extraData: any;
}
