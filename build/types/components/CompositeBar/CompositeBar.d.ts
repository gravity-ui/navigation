import { default as React, FC } from 'react';
import { MenuItem, SubheaderMenuItem } from '../types';
export type CompositeBarItem = MenuItem | SubheaderMenuItem;
type CompositeBarItems = {
    type: 'menu';
    items: MenuItem[];
} | {
    type: 'subheader';
    items: SubheaderMenuItem[];
};
export type CompositeBarProps = CompositeBarItems & {
    onItemClick?: (item: MenuItem, collapsed: boolean, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    multipleTooltip?: boolean;
    menuMoreTitle?: string;
};
export declare const CompositeBar: FC<CompositeBarProps>;
export {};
