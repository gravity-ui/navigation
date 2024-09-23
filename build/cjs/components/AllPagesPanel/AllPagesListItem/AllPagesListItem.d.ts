import React from 'react';
import { MenuItem } from '../../types';
import './AllPagesListItem.scss';
interface AllPagesListItemProps {
    item: MenuItem;
    editMode?: boolean;
    onToggle: () => void;
}
export declare const AllPagesListItem: React.FC<AllPagesListItemProps>;
export {};
