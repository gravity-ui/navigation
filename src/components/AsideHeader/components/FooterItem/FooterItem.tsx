import React from 'react';

import {block, createBlock} from '../../../utils/cn';
import {useAsideHeaderContext} from '../../AsideHeaderContext';
import {getAsideHeaderDensityConfig} from '../../density';
import {AsideHeaderItem} from '../../types';
import {Item} from '../CompositeBar/Item/Item';

import styles from './FooterItem.module.scss';

const b = createBlock('footer-item', styles);
const bGlobal = block('footer-item');

export interface FooterItemProps extends AsideHeaderItem {}

export function FooterItem(props: FooterItemProps) {
    const {menuDensity} = useAsideHeaderContext();
    const {iconSize: densityIconSize} = getAsideHeaderDensityConfig(menuDensity);

    return (
        <Item
            {...props}
            iconSize={props.iconSize ?? densityIconSize}
            className={`${b({compact: props.compact})} ${bGlobal()}`}
        />
    );
}
