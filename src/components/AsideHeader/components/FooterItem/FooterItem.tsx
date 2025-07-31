import React from 'react';

import {ASIDE_HEADER_ICON_SIZE} from '../../../constants';
import {block} from '../../../utils/cn';
import {AsideHeaderItem} from '../../types';
import {Item} from '../CompositeBar/Item/Item';

import './FooterItem.scss';

const b = block('footer-item');

export interface FooterItemProps extends AsideHeaderItem {}

export const FooterItem: React.FC<FooterItemProps> = ({item, ...props}) => {
    return (
        <Item
            {...props}
            item={{iconSize: ASIDE_HEADER_ICON_SIZE, ...item}}
            className={b({compact: props.compact})}
            onItemClick={item.onItemClick}
            onItemClickCapture={item.onItemClickCapture}
        />
    );
};
