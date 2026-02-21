import React from 'react';

import {ASIDE_HEADER_ICON_SIZE} from '../../../constants';
import {block, createBlock} from '../../../utils/cn';
import {useAsideHeaderContextOptional} from '../../AsideHeaderContext';
import {useFooterLayout} from '../../FooterLayoutContext';
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
    const {layout, isExpanded: isExpandedProp, ...restProps} = props;
    const context = useAsideHeaderContextOptional();
    const contextIsExpanded = context?.isExpanded ?? true;

    const footerLayoutCtx = useFooterLayout();
    const effectiveLayout = layout ?? footerLayoutCtx?.layout ?? 'vertical';
    const effectiveIsExpanded = isExpandedProp ?? footerLayoutCtx?.isExpanded ?? contextIsExpanded;

    return (
        <Item
            {...restProps}
            layout={effectiveLayout}
            iconSize={ASIDE_HEADER_ICON_SIZE}
            isExpanded={effectiveIsExpanded}
            className={`${b({collapsed: !effectiveIsExpanded, layout: effectiveLayout})} ${bGlobal()}`}
        />
    );
}
