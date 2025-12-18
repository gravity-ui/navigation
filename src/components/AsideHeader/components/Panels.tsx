import React from 'react';

import {Drawer} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

export const Panels = () => {
    const {panelItems, onClosePanel, size} = useAsideHeaderInnerContext();

    return panelItems ? (
        <React.Fragment>
            {panelItems.map((item) => (
                <Drawer
                    key={item.id}
                    className={b('panels')}
                    open={item.visible}
                    onOpenChange={(open) => !open && onClosePanel?.()}
                    style={{left: size}}
                    contentClassName={b('panel', item.className)}
                >
                    {item.content}
                </Drawer>
            ))}
        </React.Fragment>
    ) : null;
};
