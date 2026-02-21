import React from 'react';

export interface FooterLayoutContextValue {
    layout: 'horizontal' | 'vertical';
    isExpanded: boolean;
}

export const FooterLayoutContext = React.createContext<FooterLayoutContextValue | undefined>(
    undefined,
);

export const useFooterLayout = (): FooterLayoutContextValue | undefined =>
    React.useContext(FooterLayoutContext);
