/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import {CompositeBarItem as Aboba, Okak, SubheaderMenuItem} from '@gravity-ui/navigation';

const items: SubheaderMenuItem[] = [
    {
        item: {
            id: 'dashboard',
            title: 'Dashboard',
            link: '/dashboard',
            current: true,
        },
        compact: true,
        order: 1,
    },
    {
        item: {
            id: 'settings',
            title: 'Settings',
            link: '/settings',
        },
        compact: false,
        order: 2,
    },
];

const compositeItems: CompositeBarItem[] = [
    {
        item: {
            id: 'profile',
            title: 'Profile',
            link: '/profile',
        },
        compact: false,
    },
];

const f = compositeItems[0].item.link;

function processItems(items: SubheaderMenuItem[]) {
    const newItem = {
        item: {
            id: 'profile',
            title: 'Profile',
            link: '/profile',
        },
        compact: true,
    };

    newItem.item.link = '/Profile_OKAK';

    items.forEach((item) => {
        console.log(item.item.text);
    });
}
