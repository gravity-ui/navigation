import React from 'react';
import './AllPagesPanel.scss';
interface AllPagesPanelProps {
    className?: string;
    startEditIcon?: React.ReactNode;
    onEditModeChanged?: (isEditMode: boolean) => void;
}
export declare const AllPagesPanel: React.FC<AllPagesPanelProps>;
export {};
