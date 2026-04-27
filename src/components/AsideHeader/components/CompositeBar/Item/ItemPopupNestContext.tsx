import React from 'react';

export type ItemPopupNestContextValue = {
    registerNestedOpen: (delta: number) => void;
};

export const ItemPopupNestContext = React.createContext<ItemPopupNestContextValue | null>(null);
