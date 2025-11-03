import React from 'react';

import {FirstPanel} from '..';
import {AsideHeaderInnerContextProvider, useAsideHeaderContext} from '../../AsideHeaderContext';
import {AsideHeaderProps} from '../../types';
import {useAsideHeaderInnerContextValue} from '../../useAsideHeaderInnerContextValue';

type Props = Omit<AsideHeaderProps, 'compact' | 'size'> & {
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
};

export const PageLayoutAside = React.forwardRef<HTMLDivElement, Props>(
    ({isExpanded, setIsExpanded, handleMouseEnter, handleMouseLeave, ...props}, ref) => {
        const {size, compact} = useAsideHeaderContext();

        const asideHeaderInnerContextValue = useAsideHeaderInnerContextValue({
            size,
            compact,
            isExpanded,
            setIsExpanded,
            handleMouseEnter,
            handleMouseLeave,
            ...props,
        });

        return (
            <AsideHeaderInnerContextProvider value={asideHeaderInnerContextValue}>
                <FirstPanel ref={ref} />
            </AsideHeaderInnerContextProvider>
        );
    },
);

PageLayoutAside.displayName = 'PageLayoutAside';
