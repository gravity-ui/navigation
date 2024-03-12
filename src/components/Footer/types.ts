import {ReactNode} from 'react';

import {MenuItemProps} from '@gravity-ui/uikit';

import type {LogoProps} from '../types';

export type FooterMenuItem = Omit<MenuItemProps, 'children'> & {
    text: ReactNode;
};

export type FooterProps = {
    className?: string;
    menuItems?: FooterMenuItem[];
    withDivider?: boolean;
    moreButtonTitle?: string;
    view?: 'normal' | 'clear';
    logo?: LogoProps;
    logoWrapperClassName?: string;
    copyright: string;
};
