import React from 'react';

import {Item, ItemProps} from '../CompositeBar/Item/Item';
import {ASIDE_HEADER_ICON_SIZE} from '../constants';
import {block} from '../utils/cn';

import './FooterItem.scss';

const b = block('footer-item');

export interface FooterItemProps extends Omit<ItemProps, 'onItemClick' | 'onItemClickCapture'> {
    compact: boolean;
}

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
