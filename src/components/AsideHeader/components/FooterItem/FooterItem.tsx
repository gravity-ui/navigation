import React from 'react';

import {ASIDE_HEADER_ICON_SIZE} from '../../../constants';
import {block, createBlock} from '../../../utils/cn';
import {AsideHeaderItem} from '../../types';
import {Item} from '../CompositeBar/Item/Item';

import styles from './FooterItem.module.scss';

const b = createBlock('footer-item', styles);
const bGlobal = block('footer-item');

export interface FooterItemProps extends AsideHeaderItem {}

export function FooterItem(props: FooterItemProps) {
    return (
        <Item
            {...props}
            iconSize={ASIDE_HEADER_ICON_SIZE}
            className={`${b({collapsed: !props.pinned})} ${bGlobal()}`}
        />
    );
}
