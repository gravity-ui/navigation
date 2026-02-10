import React from 'react';

import {ASIDE_HEADER_ICON_SIZE} from '../../../constants';
import {block, createBlock} from '../../../utils/cn';
import {useAsideHeaderContextOptional} from '../../AsideHeaderContext';
import {AsideHeaderItem} from '../../types';
import {Item} from '../CompositeBar/Item/Item';

import styles from './FooterItem.module.scss';

const b = createBlock('footer-item', styles);
const bGlobal = block('footer-item');

export interface FooterItemProps extends AsideHeaderItem {
    /** Layout mode: 'horizontal' shows icon only, 'vertical' shows icon and title. Used by FooterBar. */
    layout?: 'horizontal' | 'vertical';
}

export function FooterItem(props: FooterItemProps) {
    const {layout = 'vertical', isExpanded: isExpandedProp, ...restProps} = props;
    const context = useAsideHeaderContextOptional();
    const isExpanded = isExpandedProp ?? context?.isExpanded ?? true;

    return (
        <Item
            {...restProps}
            layout={layout}
            iconSize={ASIDE_HEADER_ICON_SIZE}
            isExpanded={isExpanded}
            className={`${b({collapsed: !isExpanded, layout})} ${bGlobal()}`}
        />
    );
}
