import React from 'react';

import {FirstPanel} from '..';
import {AsideHeaderInnerContextProvider, useAsideHeaderContext} from '../../AsideHeaderContext';
import {AsideHeaderProps} from '../../types';
import {useAsideHeaderInnerContextValue} from '../../useAsideHeaderInnerContextValue';

type Props = Omit<AsideHeaderProps, 'compact' | 'size'>;

export const PageLayoutAside = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const {size, compact, isExpanded, onMouseEnter, onMouseLeave} = useAsideHeaderContext();

    const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue({
        size,
        compact,
        isExpanded,
        onMouseEnter,
        onMouseLeave,
        ...props,
    });

    return (
        <AsideHeaderInnerContextProvider value={asideHeaderInnerContextValue}>
            <FirstPanel ref={ref} />
        </AsideHeaderInnerContextProvider>
    );
});

PageLayoutAside.displayName = 'PageLayoutAside';
