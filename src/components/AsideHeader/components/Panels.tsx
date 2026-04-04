import React from 'react';

import {Drawer} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

export const Panels = () => {
    const {panelItems, onClosePanel, size} = useAsideHeaderInnerContext();

    return panelItems ? (
        <React.Fragment>
            {panelItems.map(({id, className, ...rest}) => (
                <Drawer
                    {...rest}
                    key={id}
                    className={b('panels')}
                    onOpenChange={(open) => !open && onClosePanel?.()}
                    style={{left: size, top: 'var(--gn-top-alert-height, 0px)'}}
                    contentClassName={b('panel', className)}
                />
            ))}
        </React.Fragment>
    ) : null;
};
