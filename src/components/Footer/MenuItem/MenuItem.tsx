import React from 'react';
import type {FC} from 'react';

import {Menu} from '@gravity-ui/uikit';

import {createBlock} from '../../utils/cn';
import {FooterMenuItem} from '../types';

import styles from './MenuItem.module.scss';

const b = createBlock('footer-menu-item', styles);

type MenuItemProps = FooterMenuItem;

export const MenuItem: FC<MenuItemProps> = ({text, className, ...menuItemProps}) => {
    return (
        <Menu.Item className={b(null, className)} {...menuItemProps}>
            {text}
        </Menu.Item>
    );
};
