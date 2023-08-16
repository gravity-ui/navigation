import React from 'react';
import {ASIDE_HEADER_COMPACT_WIDTH} from '../constants';

interface AsideHeaderContextType {
    compact: boolean;
    size: number;
}

export const AsideHeaderContext = React.createContext<AsideHeaderContextType>({
    compact: false,
    size: ASIDE_HEADER_COMPACT_WIDTH,
});

export const AsideHeaderContextProvider = AsideHeaderContext.Provider;

export const useAsideHeaderContext = () => React.useContext(AsideHeaderContext);
