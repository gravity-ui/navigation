import * as React from 'react';

import {ASIDE_HEADER_ICON_SIZE} from '../constants';

import {Item, ItemProps} from './Item';
import {ItemDefaultsProvider} from './LayoutContext';
import {withSlot} from './internal/slots';

export interface FooterProps {
    children?: React.ReactNode;
    /** Data-driven alternative to composing `AsideHeaderNext.Item` children. */
    items?: ItemProps[];
}

function FooterComponent(props: FooterProps) {
    const {children, items} = props;
    const content = items ? items.map((item) => <Item key={item.id} {...item} />) : children;

    return (
        <ItemDefaultsProvider value={{place: 'footer', iconSize: ASIDE_HEADER_ICON_SIZE}}>
            {content}
        </ItemDefaultsProvider>
    );
}

export const Footer = withSlot(FooterComponent, 'footer');
