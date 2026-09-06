import React from 'react';

import {FirstPanel} from '..';
import {AsideHeaderInnerContextProvider, useAsideHeaderContext} from '../../AsideHeaderContext';
import {AsideHeaderProps} from '../../types';
import {useAsideHeaderInnerContextValue} from '../../useAsideHeaderInnerContextValue';

type Props = Omit<AsideHeaderProps, 'compact' | 'size' | 'menuDensity'>;

export const PageLayoutAside = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const {size, compact, presentationCompact, menuDensity} = useAsideHeaderContext();

    const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue({
        ...props,
        size,
        compact,
        presentationCompact,
        menuDensity,
    });

    return (
        <AsideHeaderInnerContextProvider value={asideHeaderInnerContextValue}>
            <FirstPanel ref={ref} />
        </AsideHeaderInnerContextProvider>
    );
});

PageLayoutAside.displayName = 'PageLayoutAside';
