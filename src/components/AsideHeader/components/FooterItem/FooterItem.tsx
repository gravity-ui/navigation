import React from 'react';

import {ASIDE_HEADER_ICON_SIZE} from '../../../constants';
import {block} from '../../../utils/cn';
import {AsideHeaderItem} from '../../types';
import {Item} from '../CompositeBar/Item/Item';

import './FooterItem.scss';

const b = block('footer-item');

export interface FooterItemProps extends AsideHeaderItem {}

export function FooterItem(props: FooterItemProps) {
    return (
        <Item
            {...props}
            iconSize={ASIDE_HEADER_ICON_SIZE}
            className={b({compact: props.compact})}
        />
    );
}
