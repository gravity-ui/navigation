import * as React from 'react';

import {Item, ItemProps} from './Item';
import {ItemDefaultsProvider} from './LayoutContext';
import {withSlot} from './internal/slots';

export interface SubheaderProps {
    children?: React.ReactNode;
    /** Data-driven alternative to composing `AsideHeaderNext.Item` children. */
    items?: ItemProps[];
}

function SubheaderComponent(props: SubheaderProps) {
    const {children, items} = props;
    const content = items ? items.map((item) => <Item key={item.id} {...item} />) : children;

    return <ItemDefaultsProvider value={{place: 'header'}}>{content}</ItemDefaultsProvider>;
}

export const Subheader = withSlot(SubheaderComponent, 'header');
