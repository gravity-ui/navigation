import { default as React } from 'react';
import { MenuItem } from '../../types';
interface AllPagesListItemProps {
    item: MenuItem;
    editMode?: boolean;
    onToggle: () => void;
}
export declare const AllPagesListItem: React.FC<AllPagesListItemProps>;
export {};
