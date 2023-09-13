import React from 'react';

import {Drawer, DrawerItem} from '../../Drawer/Drawer';

import {useAsideHeaderContext} from '../AsideHeaderContext';
import {b} from '../asideHeaderUtils';

export const Panels = () => {
    const {panelItems, onClosePanel, size} = useAsideHeaderContext();

    return (
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
    );
};
