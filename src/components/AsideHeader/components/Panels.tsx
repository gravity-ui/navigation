import React from 'react';

import {Drawer, DrawerItem} from '../../Drawer/Drawer';
import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

export const Panels: React.FC = () => {
    const {panelItems, size, onClosePanel} = useAsideHeaderInnerContext();

    return panelItems ? (
        <Drawer
            className={b('panels')}
            onVeilClick={onClosePanel}
            onEscape={onClosePanel}
            style={{left: size}}
        >
            {panelItems.map((item) => (
                <DrawerItem key={item.id} className={b('panel')} {...item} />
            ))}
        </Drawer>
    ) : null;
};
