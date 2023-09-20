import React from 'react';

import {Drawer, DrawerItem} from '../../Drawer/Drawer';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

export const Panels = () => {
    const {panelItems, onClosePanel, size} = useAsideHeaderInnerContext();

    return panelItems ? (
        <Drawer
            className={b('panels')}
            onVeilClick={onClosePanel}
            onEscape={onClosePanel}
            style={{left: size}}
        >
            {panelItems.map((item) => (
                <DrawerItem key={item.id} {...item} />
            ))}
        </Drawer>
    ) : null;
};
