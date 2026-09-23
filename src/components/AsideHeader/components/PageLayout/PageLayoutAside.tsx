import React from 'react';

import {FirstPanel} from '..';
import {AsideHeaderInnerContextProvider, useAsideHeaderContext} from '../../AsideHeaderContext';
import {AsideHeaderProps} from '../../types';
import {useAsideHeaderInnerContextValue} from '../../useAsideHeaderInnerContextValue';

type Props = Omit<AsideHeaderProps, 'compact' | 'compactTransition' | 'size' | 'menuDensity'>;

export const PageLayoutAside = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const {size, compact, compactTransition = true, menuDensity} = useAsideHeaderContext();

    const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue({
        ...props,
        size,
        compact,
        compactTransition,
        menuDensity,
    });

    return (
        <AsideHeaderInnerContextProvider value={asideHeaderInnerContextValue}>
            <FirstPanel ref={ref} />
        </AsideHeaderInnerContextProvider>
    );
});

PageLayoutAside.displayName = 'PageLayoutAside';
