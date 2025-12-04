/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { AsideHeaderItem as Aboba, Okak } from '@gravity-ui/navigation';

const items: Aboba[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        href: '/dashboard',
        current: true,
        compact: true,
        order: 1
    },
    {
        id: 'settings',
        title: 'Settings',
        href: '/settings',
        compact: false,
        order: 2
    },
];

const compositeItems: Aboba[] = [
    {
        id: 'profile',
        title: 'Profile',
        href: '/profile',
        compact: false
    },
];

const f = compositeItems[0].href;

function processItems(items: Aboba[]) {
    const newItem = {
        id: 'profile',
        title: 'Profile',
        href: '/profile',
        compact: true
    };

    newItem.href = '/Profile_OKAK';

    items.forEach((item) => {
        console.log(item.item.text);
    });
}
