import * as React from 'react';

import {ASIDE_HEADER_ICON_SIZE} from '../constants';

import {ItemList, ItemListProps} from './ItemList';
import {withSlot} from './internal/slots';

/**
 * `Subheader` / `Menu` / `Footer` are presets over `ItemList`: a slot tag plus
 * defaults. All list behaviour lives in one implementation.
 */
export type MenuProps = Omit<ItemListProps, 'place'>;

function MenuComponent(props: MenuProps) {
    return <ItemList place="menu" tag="nav" {...props} />;
}

function SubheaderComponent(props: MenuProps) {
    return <ItemList place="header" {...props} />;
}

function FooterComponent(props: MenuProps) {
    return <ItemList place="footer" iconSize={ASIDE_HEADER_ICON_SIZE} {...props} />;
}

export const Menu = withSlot(MenuComponent, 'menu');
export const Subheader = withSlot(SubheaderComponent, 'header');
export const Footer = withSlot(FooterComponent, 'footer');
