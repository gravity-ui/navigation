import React from 'react';
import { ItemProps } from '../CompositeBar/Item/Item';
import './FooterItem.scss';
export interface FooterItemProps extends Omit<ItemProps, 'onItemClick' | 'onItemClickCapture'> {
    compact: boolean;
}
export declare const FooterItem: React.FC<FooterItemProps>;
