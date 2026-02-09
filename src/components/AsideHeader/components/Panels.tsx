import React, {useCallback} from 'react';

import {Drawer, DrawerProps} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

export const Panels: React.FC = () => {
    const {panelItems, size, onClosePanel, onFold} = useAsideHeaderInnerContext();

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
            {panelItems.map(({id, className, children, ...rest}) => (
                <Drawer
                    {...rest}
                    key={id}
                    className={b('panels')}
                    onOpenChange={handleOpenChange}
                    style={{left: size}}
                    contentClassName={b('panel', className)}
                >
                    {children}
                </Drawer>
            ))}
        </React.Fragment>
    ) : null;
};
