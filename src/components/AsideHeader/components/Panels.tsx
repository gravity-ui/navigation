import React from 'react';

import {Drawer} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b, getCompactTransitionClassName} from '../utils';

export const Panels = () => {
    const {panelItems, onClosePanel, size, compactTransition = true} = useAsideHeaderInnerContext();

    return panelItems ? (
        <React.Fragment>
            {panelItems.map(({id, className, style: itemStyle, ...rest}) => (
                <Drawer
                    {...rest}
                    key={id}
                    className={b('panels', getCompactTransitionClassName(compactTransition))}
                    onOpenChange={(open) => !open && onClosePanel?.()}
                    style={{...itemStyle, left: size, top: 'var(--gn-top-alert-height, 0px)'}}
                    contentClassName={b('panel', className)}
                />
            ))}
        </React.Fragment>
    ) : null;
};
