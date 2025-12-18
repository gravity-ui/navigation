import React, {useCallback} from 'react';

import {Drawer} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

export const Panels: React.FC = () => {
    const {panelItems, size, onClosePanel, onExpand, onFold} = useAsideHeaderInnerContext();

    const handleVeilClick = useCallback(() => {
        onFold?.();
        onClosePanel?.();
    }, [onClosePanel, onFold]);

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
                    onVeilClick={handleVeilClick}
                    onNavigationExpand={onExpand}
                >
                    {item.content}
                </Drawer>
            ))}
        </React.Fragment>
    ) : null;
};
