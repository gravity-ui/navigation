import React from 'react';
import type {FC} from 'react';

import {Menu} from '@gravity-ui/uikit';

import {block} from '../../utils/cn';
import {FooterMenuItem} from '../types';

import './MenuItem.scss';

const b = block('footer-menu-item');

type MenuItemProps = FooterMenuItem;

export const MenuItem: FC<MenuItemProps> = ({text, className, ...menuItemProps}) => {
    return (
        <Menu.Item className={b(null, className)} {...menuItemProps}>
            {text}
        </Menu.Item>
    );
};
