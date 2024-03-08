import {FooterMenuItem} from '../../types';

export const menuItems: FooterMenuItem[] = [
    {
        text: 'About Service',
        href: 'https://gravity-ui.com/',
        target: 'blank',
    },
    {
        text: 'Documentation',
        href: 'https://gravity-ui.com/',
        target: 'blank',
    },
    {
        text: 'Confidential',
        href: 'https://gravity-ui.com/',
        target: 'blank',
    },
];

export const longMenuItems = [
    ...menuItems,
    {
        text: 'Long text of the menu item',
    },
    {
        text: 'Very long text of the menu item',
    },
    {
        text: 'Very very long text of the menu item',
    },
    {
        text: 'Very very very long text of the menu item',
    },
    {
        text: 'Very very very very long text of the menu item',
    },
];
