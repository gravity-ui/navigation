import React, {useCallback} from 'react';

import {Drawer, DrawerItem} from '../../Drawer/Drawer';
import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

export const Panels: React.FC = () => {
    const {panelItems, size, onClosePanel, onExpand, onFold} = useAsideHeaderInnerContext();

    const handleVeilClick = useCallback(() => {
        onFold?.();
        onClosePanel?.();
    }, [onClosePanel, onFold]);

    return panelItems ? (
        <Drawer
            className={b('panels')}
            onVeilClick={handleVeilClick}
            onEscape={onClosePanel}
            onNavigationExpand={onExpand}
            style={{left: size}}
        >
            {panelItems.map((item) => (
                <DrawerItem key={item.id} className={b('panel')} {...item} />
            ))}
        </Drawer>
    ) : null;
};
