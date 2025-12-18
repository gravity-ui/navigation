import React, {useCallback} from 'react';

import {Drawer, DrawerProps} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

export const Panels: React.FC = () => {
    const {panelItems, size, onClosePanel, onExpand, onFold} = useAsideHeaderInnerContext();

    const handleVeilClick = useCallback(() => {
        onFold?.();
        onClosePanel?.();
    }, [onClosePanel, onFold]);

    const handleOpenChange: Required<DrawerProps>['onOpenChange'] = useCallback(
        (open, _event, reason) => {
            if (reason === 'outside-press') {
                handleVeilClick();
                return;
            }

            if (!open) {
                onClosePanel?.();
            }

            return;
        },
        [handleVeilClick, onClosePanel],
    );

    return panelItems ? (
        <React.Fragment>
            {panelItems.map((item) => (
                <Drawer
                    key={item.id}
                    className={b('panels')}
                    open={item.visible}
                    onOpenChange={handleOpenChange}
                    style={{left: size}}
                    contentClassName={b('panel', item.className)}
                >
                    <div onMouseEnter={onExpand} className={b('panel-content')}>
                        {item.content}
                    </div>
                </Drawer>
            ))}
        </React.Fragment>
    ) : null;
};
