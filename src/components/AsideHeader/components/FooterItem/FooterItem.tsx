import React from 'react';

import {block, createBlock} from '../../../utils/cn';
import {useAsideHeaderContext} from '../../AsideHeaderContext';
import {getAsideHeaderDensityConfig} from '../../density';
import {AsideHeaderItem} from '../../types';
import {Item} from '../CompositeBar/Item/Item';

import styles from './FooterItem.module.scss';

const b = createBlock('footer-item', styles);
const bGlobal = block('footer-item');

export interface FooterItemProps extends AsideHeaderItem {
    /**
     * When `true`, the item is rendered with the same geometry as regular menu
     * items (40px row, 38px icon background) instead of the reduced footer size.
     */
    regularSize?: boolean;
}

export function FooterItem({regularSize, ...props}: FooterItemProps) {
    const {menuDensity} = useAsideHeaderContext();
    const {iconSize} = getAsideHeaderDensityConfig(menuDensity);

    return (
        <Item
            {...props}
            iconSize={iconSize}
            className={`${b({compact: props.compact})} ${bGlobal({'regular-size': regularSize})}`}
        />
    );
}
