import React from 'react';
import {FirstPanel} from '..';
import {useAsideHeaderInnerContextValue} from '../../useAsideHeaderInnerContextValue';
import {AsideHeaderInnerContextProvider, useAsideHeaderContext} from '../../AsideHeaderContext';
import {AsideHeaderProps} from '../../types';

type Props = Omit<AsideHeaderProps, 'compact' | 'size'> & {maxHeight?: string};

export const PageLayoutAside = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const {size, compact} = useAsideHeaderContext();

    const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue({
        size,
        compact,
        ...props,
    });

    return (
        <AsideHeaderInnerContextProvider value={asideHeaderInnerContextValue}>
            <FirstPanel ref={ref} />
        </AsideHeaderInnerContextProvider>
    );
});
