import React from 'react';

import {Item, ItemProps} from '../CompositeBar/Item/Item';
import {ASIDE_HEADER_ICON_SIZE} from '../constants';
import {createBlock} from '../utils/cn';

import styles from './FooterItem.scss';

console.log('FooterItem styles object:', styles);
console.log('FooterItem styles keys:', Object.keys(styles || {}));

const b = createBlock('footer-item', styles);

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
